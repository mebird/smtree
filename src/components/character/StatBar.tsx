import { FunctionComponent, HTMLProps, useMemo } from 'react';
import React from 'react';

import './StatBar.css';

interface CharacterStatsProps {
    max?: number;
    deadIcon?: FunctionComponent<HTMLProps<SVGElement>>;
    liveIcon: FunctionComponent<HTMLProps<SVGElement>>;
    current: number;
}

const createIcon = (n: number, Component: FunctionComponent<HTMLProps<SVGElement>>, prefix: string) =>
    [...Array(n)].map((_, i) => <Component key={`${prefix}-heart-${i}`} className="stat-container" />);

const CharacterStats: FunctionComponent<CharacterStatsProps> = ({ max, current, deadIcon, liveIcon }) => {
    const empty = useMemo(
        () =>
            max !== undefined && max > current && deadIcon
                ? createIcon(max - (current > 0 ? current : 0), deadIcon, 'empty')
                : null,
        [max, current]
    );
    const full = useMemo(() => (current > 0 ? createIcon(current, liveIcon, 'full') : null), [current]);
    return (
        <>
            {full}
            {empty}
        </>
    );
};
export default CharacterStats;
