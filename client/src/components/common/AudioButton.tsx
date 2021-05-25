import * as React from 'react';

import audioIcon from '../../images/audio.svg';
import audioMutedIcon from '../../images/audioMuted.svg';
import { StyledAudioButton } from './AudioButton.sc';

interface IButton {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset' | undefined;
    disabled?: boolean;
    name?: string;
    variant?: 'primary' | 'secondary';
    fullwidth?: boolean;
    playing: boolean;
}

const AudioButton: React.FunctionComponent<IButton> = ({
    children,
    onClick,
    type = 'button',
    disabled,
    name,
    variant = 'primary',
    fullwidth = false,
    playing = false,
}) => (
    <StyledAudioButton
        disabled={disabled}
        onClick={onClick}
        type={type}
        name={name}
        variant={variant}
        fullwidth={fullwidth}
    >
        {playing ? <img src={audioIcon} className="muteImg" /> : <img src={audioMutedIcon} className="muteImg" />}
    </StyledAudioButton>
);

export default AudioButton;
