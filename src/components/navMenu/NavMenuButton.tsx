import { Link, navigate } from 'gatsby';
import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { SMP } from '../../Model';
import './NavMenu.css';

const SMPTitle: React.FunctionComponent<SMP> = ({ name, primary_color }) => {
    const handlers = useSwipeable({
        onSwipedRight: () => navigate(`/${name.toLowerCase()}`),
    });

    return (
        <div
            className="smp-title-container fly-in"
            style={{ boxShadow: `12px 12px ${primary_color}`, border: `6px 6px ${primary_color}` }}
            {...handlers}
        >
            <Link to={`/${name.toLowerCase()}`} style={{ textDecoration: 'none' }} key={name}>
                <div className="smp-title-text-wrapper">
                    <h1 className="smp-title-text" style={{ color: primary_color }}>
                        {name.toUpperCase()}
                    </h1>
                </div>
            </Link>
        </div>
    );
};

export default SMPTitle;
