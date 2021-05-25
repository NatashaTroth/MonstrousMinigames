import * as React from 'react';

import lobbyMusic from '../assets/audio/Lobby_Sound.wav';

export const defaultValue = {
    permission: false,
    playing: false,
    audio: new Audio(lobbyMusic),
    setPermissionGranted: () => {
        // do nothing
    },
    playLobbyMusic: () => {
        //do nothing
    },
    pauseLobbyMusic: () => {
        //do nothing
    },
};
interface IAudioContext {
    permission: boolean;
    playing: boolean;
    audio: HTMLAudioElement;
    setPermissionGranted: (val: boolean) => void;
    playLobbyMusic: (p: boolean) => void;
    pauseLobbyMusic: (p: boolean) => void;
}

export const AudioContext = React.createContext<IAudioContext>(defaultValue);

const AudioContextProvider: React.FunctionComponent = ({ children }) => {
    const [permission, setPermissionGranted] = React.useState<boolean>(false);
    const [playing, setPlaying] = React.useState<boolean>(false);
    const [audio, setAudio] = React.useState<HTMLAudioElement>(new Audio(lobbyMusic));

    const playMusic = () => {
        audio.play();
        audio.volume = 0.2;
        audio.loop = true;
        setPlaying(true);
    };

    const pauseMusic = () => {
        audio.pause();
        setPlaying(false);
    };

    const content = {
        permission,
        setPermissionGranted: (p: boolean) => {
            setPermissionGranted(p);

            //start playing here - permission doesn't update quick enough
            if (p && !playing) {
                playMusic();
            } else if (p && playing) {
                pauseMusic();
            }
        },
        playing,
        audio,
        setAudio,
        playLobbyMusic: (p: boolean) => {
            if (p && !playing) {
                playMusic();
            }
        },
        pauseLobbyMusic: (p: boolean) => {
            if (p && playing) {
                pauseMusic();
            }
        },
    };
    return <AudioContext.Provider value={content}>{children}</AudioContext.Provider>;
};

export default AudioContextProvider;
