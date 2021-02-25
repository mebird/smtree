import React from 'react';
import './IconLink.css';

interface IconTextProps {
    text: string;
    color?: string;
}

export const IconText = (props: IconTextProps) => (
    <p className="icon-text fade-in" style={{ color: props.color }}>
        {props.text}
    </p>
);
export const IconLabel = (props: IconTextProps & { for: string }) => (
    <label className="icon-text fade-in" htmlFor={props.for} style={{ color: props.color }}>
        {props.text}
    </label>
);

interface IconTextBoxProps {
    children?: React.ReactNode;
}

export const IconTextBox = (props: IconTextBoxProps) => <div className="icon-text-box">{props.children}</div>;

export default IconText;
