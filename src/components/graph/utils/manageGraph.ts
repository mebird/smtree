import { RelationshipType } from '../../../Model';
import { Node, Link } from './buildGraph';

// Update the selected* sets to toggle visibility for links connected to and neighbors of the given node
export const updateSelectedFromNode = (node: Node, selectedNodes: Set<number>, selectedLinks: Set<number>) => {
    selectedNodes.clear();
    selectedLinks.clear();
    node.neighbors.forEach(n => selectedNodes.add(n.id));
    node.links.forEach(l => selectedLinks.add(l.id));
    selectedNodes.add(node.id);
};

// Update the selected* sets to toggle visibility for nodes connected to the given link
export const updateSelectedFromLink = (link: Link, selectedNodes: Set<number>, selectedLinks: Set<number>) => {
    selectedNodes.clear();
    selectedLinks.clear();
    selectedLinks.add(link.id);
    selectedNodes.add(typeof link.source === 'number' ? link.source : link.source.id);
    selectedNodes.add(typeof link.target === 'number' ? link.target : link.target.id);
};

export type NodeFilter = (n: Node) => boolean;
export type LinkFilter = (l: Link) => boolean;

// If, with the given filters, the link should be visible.
export const getLinkVisibilityFromFilters = (
    link: Link,
    nodeFilter: NodeFilter | undefined,
    linkFilter: LinkFilter | undefined
) => {
    if (link.type === RelationshipType.NONE) return false;

    // If we have no filters, return true.
    if (!linkFilter && !nodeFilter) return true;

    // Check if the nodes on either side of this link are rendered
    //  Either
    const isConnected =
        !nodeFilter ||
        (!(typeof link.source === 'number') &&
            !(typeof link.target === 'number') &&
            nodeFilter(link.target) &&
            nodeFilter(link.source));

    // Then, if both nodes should be shown, finally check if we should show the link
    return isConnected && (!linkFilter || linkFilter(link));
};

// If, with the given filters, the node should be visible.
// If there is not a link filter, then we should also show neighbors, so check if some neighbor is linked
export const getNodeVisibilityFromFilters = (
    node: Node,
    nodeFilter: NodeFilter | undefined,
    linkFilter: LinkFilter | undefined
) => {
    if (node.id < 0) return false;

    // No filters, all the rendering
    if (!nodeFilter && !linkFilter) return true;

    // If we have a node and a link, check that we 
    if (nodeFilter && linkFilter) return nodeFilter(node) && node.links.some(l => linkFilter(l));
    if (nodeFilter) return nodeFilter(node);

    // If there's no filter, check if we're rendering a link connected to this node
    return !!linkFilter && node.links.some(l => linkFilter(l));
};
