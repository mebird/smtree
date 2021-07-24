import React from 'react';
import PropTypes from 'prop-types';
import { faHome, faInfo } from '@fortawesome/free-solid-svg-icons';
import { IconLinkInternal } from '../textAndIcons/IconLink';
import useSiteMetadata from '../../hooks/useSiteMetadata';

import './Layout.css';
import IconText from '../textAndIcons/IconText';
import SocialLinks from '../textAndIcons/SocialLinks';

// @ts-ignore
const Layout = ({ children }) => {
    const { twitter, reddit, author, youtube } = useSiteMetadata();
    return (
        <>
            <main className="content">{children}</main>
            <footer className="footer">
                <div className="footer-content fly-in">
                    <IconLinkInternal src="/" icon={faHome} tabIndex={1} />
                    <SocialLinks socials={{ twitter, reddit, youtube }} tabIndex={1} />
                    <IconLinkInternal src="/info" icon={faInfo} tabIndex={1} />
                </div>
                <div className="footer-content fly-in">
                    <IconText text={`@${author} 2020-${new Date().getFullYear()}`} />
                </div>
            </footer>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
