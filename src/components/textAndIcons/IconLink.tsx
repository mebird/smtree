import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';
import React from 'react';

import './IconLink.css';

interface IconLinkProps {
    icon: IconDefinition;
    src: string;
    tabIndex?: number;
}

export const IconLink = (props: IconLinkProps) => (
    <a href={props.src} className="icon-link fade-in" tabIndex={props.tabIndex}>
        <FontAwesomeIcon size="1x" icon={props.icon} color="white" className="icon-link-svg" />
    </a>
);

export const IconLinkInternal = (props: IconLinkProps) => (
    <Link to={props.src} className="icon-link fade-in" tabIndex={props.tabIndex}>
        <FontAwesomeIcon size="1x" icon={props.icon} color="white" className="icon-link-svg" />
    </Link>
);

export default IconLink;
