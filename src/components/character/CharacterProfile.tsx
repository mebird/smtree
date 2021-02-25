import React from 'react';
import { CharacterWithContext } from '../../Model';
import './CharacterProfile.css';
import SocialLinks from '../textAndIcons/SocialLinks';
import IconText, { IconTextBox } from '../textAndIcons/IconText';
import CharacterStats from './StatBar';
import EmptyHeart from '../../assets/EmptyHeart.svg';
import FullHeart from '../../assets/FullHeart.svg';
import MCCCoin from '../../assets/MCCCoin.svg';

interface CharacterProfileProps extends CharacterWithContext {
    onClick: () => void;
    accentColor: string;
    tabIndex?: number;
    maxLives?: number;
}

const CharacterProfile = React.forwardRef<HTMLDivElement, CharacterProfileProps>((props, ref) => {
    const {
        name,
        socials,
        quote,
        onClick,
        fields: { bodySrc } = { bodySrc: '' },
        accentColor,
        tabIndex = 0,
        maxLives,
        lives,
        wins,
    } = props;
    return (
        <div className="character fade-in" ref={ref} onClick={onClick} onFocus={onClick} tabIndex={tabIndex}>
            <div className="character-content">
                <div className="character-header">
                    <IconText text={name} />
                    {maxLives !== undefined ? (
                        <div className="character-stats">
                            <CharacterStats max={maxLives} current={lives} liveIcon={FullHeart} deadIcon={EmptyHeart} />
                        </div>
                    ) : null}
                    {wins !== undefined ? (
                        <div className="character-stats">
                            <CharacterStats current={wins} liveIcon={MCCCoin} />
                        </div>
                    ) : null}
                </div>
                <img
                    className="character-image"
                    src={bodySrc}
                    style={{ filter: `drop-shadow(-6px 9px 0 ${accentColor}) drop-shadow(-6px 9px 0 black)` }}
                />
                <div className="character-info">
                    {quote ? <IconTextBox>{quote}</IconTextBox> : null}
                    <div>
                        <SocialLinks socials={socials || {}} tabIndex={tabIndex} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CharacterProfile;
