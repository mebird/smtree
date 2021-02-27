import { CharacterWithContext, Relationship, RelationshipType } from '../../../Model';
import { uniqBy, sortBy } from 'lodash';

export interface Node extends CharacterWithContext {
    id: number;
    img: HTMLImageElement;
    name: string;
    lives: number;
    neighbors: Node[];
    links: Link[];
    x: number;
    y: number;
}

export interface Link extends Relationship {
    source: number | Node;
    target: number | Node;
    id: number;
    name: string;
    __indexColor: string;
    // The set of links that share both a source/dest with this link. Includes the link itself.
    overlapping: Link[];
}

// Finds the component from the graph, and returns an array for each,
//  sorted by the number of neighbors.
const createComponents = (nodes: Node[]): Node[][] => {
    const components = [];
    const visited = new Set<number>();
    for (const node of nodes) {
        if (visited.has(node.id)) continue;
        const toProcess = [node];
        const component: Node[] = [];
        while (toProcess.length) {
            const current = toProcess.pop() as Node;
            if (!visited.has(current.id)) {
                component.push(current);
                visited.add(current.id);
                toProcess.push(...current.neighbors);
            }
        }
        components.push(component.sort((a, b) => a.neighbors.length - b.neighbors.length));
    }
    return components;
};

export const connectComponents = (nodes: Node[], links: Link[]) => {
    // Add a ghost edge between all graph components so we don't have stuff flying out into oblivion
    const components = createComponents(nodes);
    for (let i = 1; i < components.length; i++) {
        for (let j = i; j < components.length; j++) {
            const src = components[i][0];
            const dst = components[j][0];
            if (src && dst) {
                links.push({
                    source: src.id,
                    target: dst.id,
                    id: i * -1,
                    name: '',
                    to_id: dst.id,
                    from_id: src.id,
                    type: RelationshipType.NONE,
                    smp_id: -1,
                    __indexColor: 'none',
                    overlapping: [],
                });
            }
        }
    }
};

// Augment the character array with node data and return it
export const createNodes = (characters: CharacterWithContext[], relationships: Relationship[]) => {
    const nodeMap: { [key: number]: Node } = {};
    characters.forEach(c => (nodeMap[c.character_id] = c as Node));

    for (const char of characters as Node[]) {
        const { character_id, fields: { headSrc } = { headSrc: '' } } = char;
        char.img = typeof window !== 'undefined' ? new Image() : ({} as HTMLImageElement);
        char.img.src = headSrc;
        char.id = character_id;
        char.links = [];

        const neighbors: Node[] = [];
        relationships.forEach((l, i) => {
            const { to_id, from_id } = l;
            if (from_id === character_id) {
                neighbors.push(nodeMap[to_id]);
                char.links.push(l as Link);
            } else if (to_id === character_id) {
                neighbors.push(nodeMap[from_id]);
                char.links.push(l as Link);
            }
        });
        char.neighbors = uniqBy(neighbors, 'id');
    }

    return characters as Node[];
};

const buildLabel = ({ note, season, part = '', type }: Relationship) =>
    `${season ? `S${season} | ` : ''}${part ? `${part} | ` : ''}${type}${note ? ` (${note})` : ''}`;

const isOverlapping = (l1: Link, l2: Link) =>
    (l1.from_id === l2.from_id || l1.from_id === l2.to_id) && (l1.to_id === l2.from_id || l1.to_id === l2.to_id);

// Augment the relationship array with link data and return it
export const createLinks = (relationships: Relationship[]) => {
    for (let i = 0; i < relationships.length; i++) {
        const relationship = relationships[i] as Link;
        const { from_id, to_id } = relationship;
        relationship.source = from_id;
        relationship.target = to_id;
        relationship.name = buildLabel(relationship);
        relationship.id = i;
        relationship.overlapping = sortBy(
            (relationships as Link[]).filter(
                r => r.type != RelationshipType.NONE && isOverlapping(r as Link, relationship)
            ),
            r => [r.season || Infinity, r.part || Infinity, r.type]
        );
    }
    return relationships as Link[];
};
