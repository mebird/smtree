import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { FunctionComponent, useState } from 'react';
import {
    drawNode,
    getDirectedSize,
    getLinkColor,
    getLinkWidth,
    getDirectedColor,
    getLinkCurvature,
} from './utils/styleGraph';
import './Graph.css';
import { SMPData } from '../../Model';

import { createNodes, createLinks, Link, Node, connectComponents } from './utils/buildGraph';
import {
    updateSelectedFromNode,
    updateSelectedFromLink,
    LinkFilter,
    NodeFilter,
    getLinkVisibilityFromFilters,
    getNodeVisibilityFromFilters,
} from './utils/manageGraph';
import { useWindowSize } from '@react-hook/window-size';
import GraphMenu from './menu/GraphMenu';
import ForceGraph2d, { ForceGraphMethods } from 'react-force-graph-2d';
import GraphHelpButton from './buttons/GraphHelpButton';

const zoomPadding = 200;
const loadTimeout = 2750;
const Graph: FunctionComponent<SMPData> = props => {
    const [width, height] = useWindowSize();
    const [selectedCharacters, setSelectedCharacters] = useState<Set<number>>(new Set());
    const [selectedLinks, setSelectedLinks] = useState<Set<number>>(new Set());
    const [lastClickedCharacter, setLastClickedCharacter] = useState<number | undefined>(undefined);
    const [nodeFilter, setNodeFilter] = useState<NodeFilter | undefined>(undefined);
    const [linkFilter, setLinkFilter] = useState<LinkFilter | undefined>(undefined);

    const {
        characters,
        relationships,
        smp: { primary_color },
    } = props;

    const [nodes, links] = useMemo<[Node[], Link[]]>(() => {
        const nodes = createNodes([...characters], [...relationships]);
        const links = createLinks([...relationships]);
        connectComponents(nodes, links);
        return [nodes, links];
    }, [characters, relationships]);

    const ref = useRef<ForceGraphMethods>();
    const updateSelected = () => {
        setSelectedCharacters(selectedCharacters);
        setSelectedLinks(selectedLinks);
        ref.current &&
            (selectedCharacters.size || selectedLinks.size) &&
            ref.current.zoomToFit(1000, zoomPadding, n => {
                const node = n as Node;
                return selectedCharacters.has(node.id) || node.links.some(l => selectedLinks.has(l.id));
            });
    };

    const handleNodeClick = (n: Node) => {
        if (!n) return;
        updateSelectedFromNode(n, selectedCharacters, selectedLinks);
        updateSelected();
        setLastClickedCharacter(n.id);
    };

    const handleLinkClick = (l: Link) => {
        if (!l) return;
        updateSelectedFromLink(l, selectedCharacters, selectedLinks);
        updateSelected();
    };

    const zoomToFiltered = () => {
        if (ref.current) {
            ref.current.zoomToFit(1000, zoomPadding, n =>
                getNodeVisibilityFromFilters(n as Node, nodeFilter, linkFilter)
            );
        }
    };

    const handleBackgroundClick = () => {
        selectedCharacters.clear();
        selectedLinks.clear();
        setLastClickedCharacter(undefined);
        zoomToFiltered();
    };

    // Setting up d3 multibody forces
    useLayoutEffect(() => {
        if (ref.current) {
            // @ts-ignore
            ref.current.d3Force('charge')?.strength(-500000);
            ref.current.zoom(5);
            setTimeout(() => ref.current && ref.current.centerAt(0, 0).zoomToFit(1000, zoomPadding), loadTimeout);
        }
    }, []);

    // Set up the div double click event
    const divRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (divRef.current) {
            divRef.current.ondblclick = handleBackgroundClick;
        }
    }, []);

    const runLinkFilter = useCallback((l: Link) => getLinkVisibilityFromFilters(l, nodeFilter, linkFilter), [
        nodeFilter,
        linkFilter,
    ]);

    const runNodeFilter = useCallback((n: Node) => getNodeVisibilityFromFilters(n, nodeFilter, linkFilter), [
        nodeFilter,
        linkFilter,
    ]);

    const setFilters = (nodeFilter: NodeFilter | undefined, linkFilter: LinkFilter | undefined) => {
        setNodeFilter(() => nodeFilter);
        setLinkFilter(() => linkFilter);
        selectedCharacters.clear();
        selectedLinks.clear();
        setSelectedCharacters(selectedCharacters);
        setSelectedLinks(selectedLinks);
        zoomToFiltered();
    };

    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setTimeout(() => setIsLoaded(true), loadTimeout);
    }, []);

    return (
        <>
            <div className={`graph-overlay ${isLoaded ? 'fly-out' : 'fly-in'}`}>
                <img
                    src={nodes[0].fields?.headSrc}
                    style={{ filter: `drop-shadow(-6px 9px 0 ${primary_color}) drop-shadow(-6px 9px 0 black)` }}
                />
            </div>
            <div className="graph-wrapper" ref={divRef} style={{ display: isLoaded ? '' : 'none' }}>
                <ForceGraph2d
                    ref={ref}
                    width={width}
                    height={height}
                    nodeVal={3900}
                    graphData={{ links, nodes }}
                    nodeCanvasObject={(n, ctx) =>
                        drawNode(n as Node, ctx, selectedCharacters, selectedLinks, primary_color)
                    }
                    // @ts-ignore
                    nodeVisibility={runNodeFilter}
                    // @ts-ignore
                    linkColor={getLinkColor}
                    linkAutoColorBy="type"
                    // @ts-ignore
                    linkDirectionalArrowLength={getDirectedSize}
                    linkDirectionalArrowColor={l =>
                        getDirectedColor(l as Link, selectedLinks, selectedCharacters) as string
                    }
                    // @ts-ignore
                    linkVisibility={runLinkFilter}
                    linkWidth={l => getLinkWidth(l as Link, selectedLinks, selectedCharacters)}
                    cooldownTicks={1000}
                    // @ts-ignore
                    onEngineStop={zoomToFiltered}
                    // @ts-ignore
                    onNodeClick={handleNodeClick}
                    // @ts-ignore
                    onLinkClick={handleLinkClick}
                    linkCurvature={l => getLinkCurvature(l as Link, nodeFilter, linkFilter)}
                />
            </div>
            <GraphMenu
                {...props}
                // @ts-expect-error
                style={{ display: isLoaded ? '' : 'none' }}
                characters={nodes.filter(n => getNodeVisibilityFromFilters(n, nodeFilter, linkFilter))}
                lastClickedCharacter={lastClickedCharacter}
                setLastClickedCharacter={i => handleNodeClick(nodes.find(n => n.id === i) as Node)}
                setFilters={setFilters}
                nodeFilter={nodeFilter}
                linkFilter={linkFilter}
            />
            <GraphHelpButton accentColor={primary_color} />
        </>
    );
};

export default Graph;
