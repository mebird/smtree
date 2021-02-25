import { faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { RefObject, useRef, useState } from 'react';
import GraphFooterButton from './GraphFooterButton';
import './GraphButton.css';
import IconText, { IconTextBox } from '../../textAndIcons/IconText';
import rgba from 'hex-to-rgba';
import GraphSmallButton from './GraphSmallButton';

const GraphHelpButton = (props: { accentColor: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { accentColor } = props;

    const buttonRef = useRef() as RefObject<HTMLButtonElement>;
    return (
        <>
            <div
                className="graph-help-btn-modal-wrapper"
                style={{
                    backgroundColor: rgba(accentColor, 0.25),
                    display: isOpen ? 'block' : 'none',
                }}
            >
                <div className="graph-help-btn-modal fly-in">
                    <IconTextBox>
                        <IconText text="Welcome to the SMTree." />
                        <ul>
                            <li>Click on a node or a link to focus the graph.</li>
                            <li>Scroll to zoom, and drag to move.</li>
                            <li>
                                Use the menu to the right to look through the character list and filter nodes/edges.
                            </li>
                            <li>Double click/tap to refocus the graph.</li>
                            <li>If the graph bugs out, refresh the page.</li>
                            <li>Best viewed on desktop.</li>
                            <li>keep it cool, @hydrationnation</li>
                        </ul>
                        <IconText text="Changelog" />
                        <ul>
                            <li>11/30/2020: Added curved edges to represent multiple links between two nodes.</li>
                        </ul>
                        <GraphSmallButton
                            icon={faTimes}
                            accentColor={accentColor}
                            onClick={() => setIsOpen(o => !o)}
                            ref={buttonRef}
                        />
                    </IconTextBox>
                </div>
            </div>
            <GraphFooterButton
                onClick={() =>
                    setIsOpen(o => {
                        if (o && buttonRef.current) buttonRef.current.focus();
                        return !o;
                    })
                }
                accentColor={accentColor}
                icon={faQuestion}
                tabIndex={3}
            />
        </>
    );
};

export default GraphHelpButton;
