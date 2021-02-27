import { faSync } from '@fortawesome/free-solid-svg-icons';
import React, {
    createRef,
    useEffect,
    useReducer,
    FunctionComponent,
    Reducer,
    useRef,
    MutableRefObject,
    RefObject,
} from 'react';
import { flatten } from 'lodash';
import { SMPData } from '../../../Model';
import { LinkFilter, NodeFilter } from '../utils/manageGraph';
import { GraphMenuTopButton } from '../buttons/GraphScrollButtons';
import { GraphFooterButton } from '../buttons/GraphFooterButton';

import IconText from '../../textAndIcons/IconText';
import GraphFilterSelect from './GraphFilterInputs';
import { andLinkFilterGenerator, andNodeFilterGenerator } from '../utils/buildFilter';
import { Link, Node } from '../utils/buildGraph';

export interface GraphFilterMenuProps extends SMPData {
    setFilters: (nf: NodeFilter | undefined, fl: LinkFilter | undefined) => void;
    forceClear: boolean;
    isOpen: boolean;
}

// Create a set of options indexed with the given field from the provided record set
const createOptions = (srcField: string, values: Record<string, any>[], destField?: string): Record<string, any>[] =>
    Array.from(new Set(flatten(values.map(v => v[srcField]))))
        .filter(v => v !== '' && v !== undefined && v !== null)
        .sort()
        .map(v => ({ [destField || srcField]: v }));

type GraphFilterState<T> = {
    [K in keyof Partial<T>]: {
        type: K;
        label: string;
        options: Record<K, T[K][]>[];
        values: Record<K, T[K]>[];
    };
};

type GraphFilterAction<T> = {
    type: keyof GraphFilterState<T>;
    value: { [K in keyof Partial<T>]: T[K][] };
};

type GraphFilterReducer<T> = Reducer<GraphFilterState<T>, GraphFilterAction<T>>;

const reducer: GraphFilterReducer<Node & Link> = (s, a) => ({ ...s, [a.type]: { ...s[a.type], values: a.value } });
const clearStateData = <T extends {}>(a: GraphFilterState<T>, d: React.Dispatch<GraphFilterAction<T>>) =>
    Object.values(a).forEach(
        v =>
            v &&
            d({
                //@ts-ignore
                type: v.type,
                //@ts-ignore
                value: [],
            })
    );

const createFilterSelect = <T extends Node | Link>(
    tabIndex: number,
    color: string,
    a: GraphFilterState<T>,
    d: React.Dispatch<GraphFilterAction<T>>
) => (
    <>
        {Object.values(a)
            .filter(v => !!v && v.options.length)
            .map(v => (
                <GraphFilterSelect
                    onChange={e =>
                        d({
                            // @ts-ignore
                            value: e,
                            type: v.type,
                        })
                    }
                    field={v.type}
                    options={v.options}
                    values={v.values}
                    label={v.label}
                    key={v.type + v.label}
                    tabIndex={tabIndex}
                    color={color}
                />
            ))}
    </>
);

const createFilterData = (state: GraphFilterState<Link | Node>) =>
    Object.values(state).reduce((acc, s) => {
        if (!s || s.type === undefined || !s.values.length) return acc;
        // @ts-ignore
        acc.push([s.type, [s.values.map(v => v[s.type])]]);
        return acc;
    }, []);

const GraphFilterMenu: FunctionComponent<GraphFilterMenuProps> = props => {
    const {
        characters,
        relationships,
        smp: { primary_color },
        setFilters,
        forceClear,
        isOpen,
    } = props;

    const [nodeFilterState, dispatchNodeFilterState] = useReducer(reducer, {
        name: {
            options: createOptions('name', characters),
            label: 'named',
            type: 'name',
            values: [],
        },
        lives: {
            options: createOptions('lives', characters),
            label: 'with x lives',
            type: 'lives',
            values: [],
        },
        wins: {
            options: createOptions('wins', characters),
            label: 'with x wins',
            type: 'wins',
            values: [],
        },
        links: {
            options: createOptions('name', characters, 'links'),
            label: 'connected to one of these people',
            type: 'links',
            values: [],
        },
        factions: {
            options: createOptions('factions', characters),
            type: 'factions',
            label: 'from one of',
            values: [],
        },
    });

    const [linkFilterState, dispatchLinkFilterState] = useReducer(reducer, {
        type: {
            label: 'with a relationship type from',
            type: 'type',
            options: createOptions('type', relationships),
            values: [],
        },
        season: {
            label: 'from season',
            type: 'season',
            options: createOptions('season', relationships),
            values: [],
        },
        part: {
            label: 'from one of the following games/arcs',
            type: 'part',
            options: createOptions('part', relationships),
            values: [],
        },
    });

    useEffect(() => {
        if (isOpen) {
            const linkFilterData = createFilterData(linkFilterState);
            const nodeFilterData = createFilterData(nodeFilterState);
            setFilters(
                nodeFilterData.length ? andNodeFilterGenerator(nodeFilterData) : undefined,
                linkFilterData.length ? andLinkFilterGenerator(linkFilterData) : undefined
            );
        }
    }, [...Object.values(linkFilterState).map(v => v?.values), ...Object.values(nodeFilterState).map(v => v?.values)]);

    const clearData = () => {
        clearStateData(linkFilterState, dispatchLinkFilterState);
        clearStateData(nodeFilterState, dispatchNodeFilterState);
    };

    useEffect(clearData, [forceClear]);

    const filterTabIndex = isOpen ? 2 : -1;
    const topRef = createRef<HTMLAnchorElement>();

    useEffect(() => {
        if (isOpen && topRef.current) {
            topRef.current.focus();
        }
    }, [isOpen]);

    return (
        <div className="graph-filter-menu" style={{ display: isOpen ? '' : 'none' }}>
            <a tabIndex={isOpen ? 2 : -1} ref={topRef}>
                <div className="graph-filter-menu-header">
                    <IconText text="show characters..." />
                </div>
            </a>
            <div className="graph-filter-menu-contents">
                {createFilterSelect(filterTabIndex, primary_color, nodeFilterState, dispatchNodeFilterState)}
                {createFilterSelect(filterTabIndex, primary_color, linkFilterState, dispatchLinkFilterState)}
            </div>
            <div className="graph-menu-footer">
                <GraphFooterButton
                    tabIndex={filterTabIndex}
                    accentColor={primary_color}
                    onClick={clearData}
                    icon={faSync}
                    label="Reset Filters"
                    text="reset"
                />
                <GraphMenuTopButton topRef={topRef} accentColor={primary_color} tabIndex={filterTabIndex} />
            </div>
        </div>
    );
};

export default GraphFilterMenu;
