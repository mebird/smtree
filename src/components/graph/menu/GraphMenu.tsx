import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import rgba from 'hex-to-rgba';
import { GraphMenuToggle } from '../buttons/GraphScrollButtons';
import { GraphSmallButton } from '../buttons/GraphSmallButton';
import { faFilter, faRandom } from '@fortawesome/free-solid-svg-icons';
import GraphCharacterMenu, { GraphCharacterMenuProps } from './GraphCharacterMenu';
import GraphFilterMenu, { GraphFilterMenuProps } from './GraphFilterMenu';
import { Node } from '../utils/buildGraph';
import { getNodeVisibilityFromFilters } from '../utils/manageGraph';

import './GraphMenu.css';

export type GraphMenuProps = Omit<
    GraphFilterMenuProps & GraphCharacterMenuProps,
    'isOpen' | 'view' | 'tabIndex' | 'forceClear' | 'selectedCharacter'
> & { style: React.HTMLAttributes<HTMLDivElement> };

enum MenuEnum {
    CHARACTER = 'character',
    FILTER = 'filter',
}

const GraphMenu: FunctionComponent<GraphMenuProps> = props => {
    const {
        lastClickedCharacter,
        setLastClickedCharacter,
        characters,
        smp: { primary_color },
        nodeFilter,
        linkFilter,
        style,
        setFilters,
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    const [forceCharacterRerender, setForceCharacterRerender] = useState(true);
    const [forceFilterRerender, setForceFilterRerender] = useState(true);

    const onEscape = useCallback((e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false), []);
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', onEscape, false);
            return () => document.removeEventListener('keydown', onEscape, false);
        }
    }, [isOpen]);

    const randomizeCharacter = () => {
        // Grab the next character that should be shown on the filter menu
        const validCharacters =
            nodeFilter || linkFilter
                ? characters.filter(c => getNodeVisibilityFromFilters(c as Node, nodeFilter, linkFilter))
                : characters;
        if (validCharacters.length === 0) return;

        // Grab a new ID
        let id;
        if (validCharacters.length === 1) {
            id = validCharacters[0].character_id;
        } else {
            do {
                id = validCharacters[Math.floor(Math.random() * validCharacters.length)].character_id;
            } while (id === lastClickedCharacter);
        }

        setLastClickedCharacter(id);
    };

    const [menuView, setMenuView] = useState<MenuEnum>(MenuEnum.CHARACTER);

    const selectedCharacterFull: Node = useMemo(
        () => characters.find(c => c.character_id === lastClickedCharacter) || characters[0],
        [lastClickedCharacter]
    ) as Node;

    const toggleMenu = () => setIsOpen(o => !o);

    const handlers = useSwipeable({
        onSwipedLeft: toggleMenu,
        onSwipedRight: toggleMenu,
    });

    return (
        <div
            className={`graph-menu ${isOpen ? 'graph-menu-open' : ''}`}
            {...handlers}
            aria-expanded={isOpen}
            style={style}
        >
            <GraphMenuToggle isOpen={isOpen} onClick={toggleMenu} accentColor={primary_color} />
            <div className="graph-menu-navbar">
                <GraphSmallButton
                    label="Random Character"
                    onClick={() => {
                        randomizeCharacter();
                        setFilters(undefined, undefined);
                        setForceFilterRerender(v => !v);
                        setMenuView(MenuEnum.CHARACTER);
                    }}
                    accentColor={primary_color}
                    icon={faRandom}
                    tabIndex={isOpen ? 2 : -1}
                />
                <button
                    className="graph-menu-btn graph-menu-navbar-pfp"
                    tabIndex={isOpen ? 2 : -1}
                    onClick={() => {
                        setMenuView(MenuEnum.CHARACTER);
                        setForceCharacterRerender(v => !v);
                    }}
                >
                    <img src={selectedCharacterFull.fields?.headSrc} className="graph-menu-navbar-pfp" />
                </button>
                <GraphSmallButton
                    onClick={() => setMenuView(MenuEnum.FILTER)}
                    accentColor={primary_color}
                    icon={faFilter}
                    tabIndex={isOpen ? 2 : -1}
                />
            </div>
            <div className="graph-menu-contents" style={{ backgroundColor: rgba(primary_color, 0.25) }}>
                <GraphCharacterMenu
                    {...props}
                    isOpen={menuView === MenuEnum.CHARACTER && isOpen}
                    view={forceCharacterRerender}
                    selectedCharacter={selectedCharacterFull}
                />
                <GraphFilterMenu
                    {...props}
                    forceClear={forceFilterRerender}
                    isOpen={menuView == MenuEnum.FILTER && isOpen}
                />
            </div>
        </div>
    );
};

export default GraphMenu;
