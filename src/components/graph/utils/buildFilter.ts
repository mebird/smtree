import { Link, Node } from './buildGraph';
import { LinkFilter, NodeFilter } from './manageGraph';

const pass = () => () => true;

type FiltersWithContext<T, F> = { [K in keyof Required<T>]: (selected: T[K][]) => F };

export const linkFilters: FiltersWithContext<Link, LinkFilter> = {
    type: types => l => types.includes(l.type),
    to_id: pass,
    from_id: pass,
    smp_id: pass,
    smp: pass,
    to: pass,
    from: pass,
    note: pass,
    season: ss => l => ss.includes(l.season),
    part: ps => l => ps.includes(l.part),
    source: pass,
    target: pass,
    id: pass,
    name: pass,
    __indexColor: pass,
    overlapping: pass,
};

export const nodeFilters: FiltersWithContext<Node, NodeFilter> = {
    character_id: pass,
    ign: pass,
    name: ns => n => ns.includes(n.name),
    uuid: pass,
    smp_id: pass,
    lives: ls => n => ls.includes(n.lives),
    wiki_url: pass,
    faction: fs => n => fs.includes(n.faction),
    wins: ws => n => ws.includes(n.wins),
    socials: pass,
    fields: pass,
    quote: pass,
    smpMetadata: pass,
    smp: pass,
    character: pass,
    id: pass,
    img: pass,
    x: pass,
    y: pass,
    neighbors: pass,
    links: ls => n => {
        const names = (ls as unknown) as string[];
        return (
            names.includes(n.name) ||
            n.links.some(
                l =>
                    (typeof l.target !== 'number' && names.includes(l.target.name)) ||
                    (typeof l.source !== 'number' && names.includes(l.source.name))
            )
        );
    },
};

type MappedChainFilterTuple<T, F> = {
    [K in keyof FiltersWithContext<T, F>]: [K, Parameters<FiltersWithContext<T, F>[K]>];
};

export type ChainedFilterData<T, F> = MappedChainFilterTuple<T, F>[keyof MappedChainFilterTuple<T, F>];

const chainedFilter = <T, F, R>(
    n: T,
    src: FiltersWithContext<T, F>,
    data: ChainedFilterData<T, F>[],
    reducer: (acc: R, next: R) => R,
    init: R
    // @ts-ignore
): R => data.reduce((acc, [key, args]) => reducer(acc, !args[0].length || src[key](args[0])(n)), init);

export const andNodeFilterGenerator = (data: ChainedFilterData<Node, boolean>[]) => (n: Node) =>
    chainedFilter<Node, NodeFilter, boolean>(n, nodeFilters, data, (a, b) => a && b, true);

export const andLinkFilterGenerator = (data: ChainedFilterData<Link, boolean>[]) => (n: Link) =>
    chainedFilter<Link, LinkFilter, boolean>(n, linkFilters, data, (a, b) => a && b, true);
