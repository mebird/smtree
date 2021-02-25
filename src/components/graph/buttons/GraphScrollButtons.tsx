import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faArrowUp, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import React, { RefObject } from 'react';
import { FunctionComponent } from 'react';
import { GraphFooterButton } from './GraphFooterButton';
import { GraphButtonProps, scrollToRef } from './GraphButtonProps';
import './GraphButton.css';

export const GraphMenuToggle: FunctionComponent<GraphButtonProps> = props => {
    const { accentColor, isOpen, label, ...rest } = props;
    return (
        <button
            {...rest}
            type="button"
            className="graph-menu-toggle graph-menu-btn fly-in"
            style={{ backgroundClip: accentColor }}
            tabIndex={2}
            aria-label={label || `${isOpen ? 'Open' : 'Close'} Character Menu`}
        >
            <FontAwesomeIcon size="3x" icon={isOpen ? faAngleRight : faAngleLeft} color={accentColor} />
        </button>
    );
};

export const GraphMenuTopButton: FunctionComponent<{
    topRef?: RefObject<HTMLElement>;
    accentColor: string;
    tabIndex: number;
}> = ({ topRef, accentColor, tabIndex }) =>
    topRef ? (
        <GraphFooterButton
            accentColor={accentColor}
            icon={faArrowUp}
            label={'To Top'}
            onClick={() => scrollToRef(topRef)}
            text="top"
            tabIndex={tabIndex}
            disabled={!topRef}
        />
    ) : null;

export default GraphMenuToggle;
