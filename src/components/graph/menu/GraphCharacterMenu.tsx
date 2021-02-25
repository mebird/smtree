import React, { createRef, Fragment, FunctionComponent, RefObject, useEffect, useMemo } from 'react';
import { CharacterWithContext, SMPData } from '../../../Model';
import CharacterProfile from '../../character/CharacterProfile';
import { Node } from '../utils/buildGraph';
import { getNodeVisibilityFromFilters, LinkFilter, NodeFilter } from '../utils/manageGraph';
import { GraphMenuTopButton } from '../buttons/GraphScrollButtons';
import { scrollToRef } from '../buttons/GraphButtonProps';

export type RefMap = { [key: number]: RefObject<HTMLDivElement> };

export interface GraphCharacterMenuProps extends SMPData {
    setLastClickedCharacter: (n: number | undefined) => void;
    selectedCharacter: Node;
    lastClickedCharacter: number | undefined;
    isOpen: boolean;
    view: any;
    nodeFilter: NodeFilter | undefined;
    linkFilter: LinkFilter | undefined;
}

const GraphCharacterMenu: FunctionComponent<GraphCharacterMenuProps> = props => {
    const {
        characters,
        setLastClickedCharacter,
        smp: { primary_color, max_lives },
        lastClickedCharacter,
        selectedCharacter,
        isOpen,
        view,
        nodeFilter,
        linkFilter,
    } = props;

    const refs: RefMap = useMemo(() => {
        const ret: RefMap = {};
        characters.forEach(c => (ret[c.character_id] = createRef()));
        return ret;
    }, [characters]);

    const focusClicked = () => {
        if (lastClickedCharacter && refs[lastClickedCharacter] && characters.length)
            scrollToRef(
                getNodeVisibilityFromFilters(selectedCharacter, nodeFilter, linkFilter)
                    ? refs[lastClickedCharacter]
                    : refs[characters[0].character_id]
            );
    };

    useEffect(() => {
        if (isOpen && lastClickedCharacter) focusClicked();
    }, [lastClickedCharacter, view]);

    useEffect(() => {
        if (isOpen && lastClickedCharacter && refs[lastClickedCharacter]) focusClicked();
    }, [isOpen]);

    const tabIndex = isOpen ? 3 : -1;
    return (
        <div style={{ display: isOpen ? '' : 'none' }}>
            {characters.map((c, i) => (
                <Fragment key={c.character_id}>
                    <CharacterProfile
                        {...c}
                        onClick={() => setLastClickedCharacter(c.character_id)}
                        ref={refs[c.character_id]}
                        key={c.character_id}
                        accentColor={primary_color}
                        tabIndex={tabIndex}
                        maxLives={max_lives}
                    />
                </Fragment>
            ))}
            <div className="graph-menu-footer">
                <GraphMenuTopButton
                    topRef={characters.length ? refs[characters[0].character_id] : undefined}
                    accentColor={primary_color}
                    tabIndex={tabIndex}
                />
            </div>
        </div>
    );
};

export default GraphCharacterMenu;
