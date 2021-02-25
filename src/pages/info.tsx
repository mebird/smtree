import React, { Fragment } from 'react';
import SEO from '../components/seo';
import './index.css';

interface Credit {
    name: string;
    link?: string;
}

const inspiration: Credit[] = [
    {
        name: 'u/kaleflys',
        link: 'https://www.reddit.com/r/dreamsmp/comments/jwytiq/full_official_unofficial_cannon_dream_smp_family/',
    },
    {
        name: '@mastergarf',
        link: 'https://twitter.com/MasterGarf',
    },
    {
        name: 'the dreamsmp wiki',
        link: 'https://dreamteam.fandom.com/wiki/Dream_Team_SMP',
    },
    {
        name: 'the mcc wiki',
        link: 'https://mcchampionship.fandom.com/wiki',
    },
    {
        name: "wilbur soot's cryptic ass",
        link: 'https://www.reddit.com/user/WilburSoot',
    },
];

const images: Credit[] = [
    { name: 'crafatar', link: 'https://crafatar.com' },
    { name: 'the minecraft wiki', link: 'https://minecraft.gamepedia.com' },
];

const buildWith: Credit[] = [
    {
        name: 'gatsby',
        link: 'https://www.gatsbyjs.com/',
    },
    {
        name: 'love and care',
        link: 'https://www.youtube.com/watch?v=PPQeFChXr3k',
    },
    {
        name: 'the tears of those orphans',
        link: '',
    },
];

const InfoPage = () => {
    return (
        <div className="homepage-content">
            <SEO title="Info" description="whoami" />
            <div className="info-content fly-in">
                <h1 className="info-name">mebird.</h1>
                <div>
                    <p>
                        a.k.a moonbird
                        <br />
                        west coast typescript nerd.
                        <br />
                        hmu on twitter.
                    </p>
                </div>
            </div>
            <div className="fly-in">
                <div className="info-content" key="credits">
                    <p className="info-credits-header">data derived from...</p>
                    {inspiration.map((c, i) => (
                        <Fragment key={c.name}>
                            {i ? <br /> : null}
                            <a href={c.link} className="info-credits-link">
                                {c.name}
                            </a>
                        </Fragment>
                    ))}
                </div>
                <div className="info-content" key="img-src">
                    <p className="info-credits-header">assets from...</p>
                    {images.map((c, i) => (
                        <Fragment key={c.name}>
                            {i ? <br /> : null}
                            <a href={c.link} className="info-credits-link">
                                {c.name}
                            </a>
                        </Fragment>
                    ))}
                </div>
                <div className="info-content" key="bw">
                    <p className="info-credits-header">built with...</p>
                    {buildWith.map((c, i) => (
                        <Fragment key={c.name}>
                            {i ? <br /> : null}
                            <a href={c.link} className="info-credits-link">
                                {c.name}
                            </a>
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default InfoPage;
