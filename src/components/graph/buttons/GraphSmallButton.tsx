import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FunctionComponent } from 'react';
import { GraphButtonProps } from './GraphButtonProps';
import './GraphButton.css';

export const GraphSmallButton: FunctionComponent<GraphButtonProps & { icon: IconDefinition }> = props => {
    const { tabIndex = 1, label, accentColor, icon, ...rest } = props;
    return (
        <button
            {...rest}
            type="button"
            className="graph-menu-btn graph-menu-btn-sm"
            tabIndex={tabIndex}
            aria-label={label}
        >
            <FontAwesomeIcon size="2x" icon={icon} color={accentColor} />
        </button>
    );
};

export default GraphSmallButton;
