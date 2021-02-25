import { Link } from 'gatsby';
import React, { Fragment } from 'react';
import { FunctionComponent } from 'react';
import useSMPData from '../../hooks/useSMPData';
import SMPTitle from './NavMenuButton';
import './NavMenu.css';

const SMPNavMenu: FunctionComponent = () => {
    const smps = useSMPData();
    return (
        <div className="smp-menu">
            {smps.map((smp, i) => (
                <Fragment key={smp.name}>
                    {i ? <div className="smp-menu-spacer" /> : null}
                    <SMPTitle {...smp} />
                </Fragment>
            ))}
        </div>
    );
};

export default SMPNavMenu;
