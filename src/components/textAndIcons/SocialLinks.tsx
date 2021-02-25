import { Socials } from '../../Model';
import IconLink from './IconLink';
import {
    faTwitter,
    faGithub,
    faRedditAlien,
    faInstagram,
    faTwitch,
    faYoutube,
    faTiktok,
    IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import React, { useMemo } from 'react';

const icons: { [key: string]: IconDefinition } = {
    youtube: faYoutube,
    github: faGithub,
    reddit: faRedditAlien,
    instagram: faInstagram,
    twitch: faTwitch,
    twitter: faTwitter,
    tiktok: faTiktok,
    other: faLink,
};

interface SocialLinkProps {
    socials: Socials;
    tabIndex?: number;
}

const SocialLinks = ({ socials, tabIndex = 1 }: SocialLinkProps) => {
    const mappedSocials: [IconDefinition, string][] = useMemo(
        () =>
            Object.entries(socials)
                .filter(([_, value]) => !!value)
                .map(([type, value]) => [icons[type] || faLink, value]),
        [socials]
    );

    return (
        <>
            {mappedSocials.map(([icon, value], i) => (
                <IconLink icon={icon} src={value} key={i} tabIndex={tabIndex} />
            ))}
        </>
    );
};

export default SocialLinks;
