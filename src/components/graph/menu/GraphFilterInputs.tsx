import React, { useState } from 'react';
import Select, { SelectProps } from 'react-dropdown-select';
import { IconLabel } from '../../textAndIcons/IconText';
import { isMobile } from 'react-device-detect';

interface GraphFilterInputProps {
    label: string;
    tabIndex: number;
}

type GraphFilterSelectProps = Required<Pick<SelectProps<any>, 'onChange' | 'values' | 'options' | 'color'>> & {
    field: string;
} & GraphFilterInputProps;

export const GraphFilterSelect = (props: GraphFilterSelectProps) => {
    const [hasBeenClicked, setHasBeenClicked] = useState(false);
    return (
        <div className="graph-filter-select-wrapper">
            <IconLabel text={props.label} for={`${props.label}-select`} />
            <Select
                {...(props || {})}
                onChange={
                    hasBeenClicked
                        ? props.onChange
                        : v => {
                              setHasBeenClicked(s => !s);
                              props.onChange(v);
                          }
                }
                valueField={props.field}
                labelField={props.field}
                multi={true}
                className="icon-text-box graph-filter-select"
                additionalProps={{ id: `${props.label}-select`, tabIndex: props.tabIndex }}
                disabled={props.tabIndex === -1}
                searchable={!isMobile}
                dropdownGap={hasBeenClicked ? 5 : 40}
                clearable={true}
            />
        </div>
    );
};

type GraphFilterRangeProps = GraphFilterInputProps & { max: number; min: number };

export const GraphFilterRange = (props: GraphFilterRangeProps) => (
    <div>
        <IconLabel text={props.label} for={`${props.label}-slider`} />
        {props.min} {props.max}
    </div>
);

export default GraphFilterSelect;
