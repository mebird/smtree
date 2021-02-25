import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FunctionComponent } from 'react';
import IconText from '../../textAndIcons/IconText';
import { GraphButtonProps } from './GraphButtonProps';
import './GraphButton.css';

export const GraphFooterButton: FunctionComponent<
    GraphButtonProps & { text?: string; icon: IconDefinition }
> = props => {
    const { accentColor, label, icon, text, ...rest } = props;
    return (
        <button
            {...rest}
            type="button"
            className={`graph-menu-btn graph-button-slide-up fly-in`}
            style={{ backgroundClip: accentColor }}
            aria-label={label}
        >
            <FontAwesomeIcon size="3x" icon={icon} color={accentColor} />
            {text ? (
                <div className="graph-menu-btn-text">
                    <IconText text={text} />
                </div>
            ) : null}
        </button>
    );
};

export default GraphFooterButton;
