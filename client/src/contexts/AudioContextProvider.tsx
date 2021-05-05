import * as React from 'react';

import lobbyMusic from '../assets/audio/Lobby_Sound.wav';

export const defaultValue = {
    permission: false,
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
    setPermissionGranted: (val: boolean) => void;
    playLobbyMusic: (p: boolean) => void;
    pauseLobbyMusic: (p: boolean) => void;
}

export const AudioContext = React.createContext<IAudioContext>(defaultValue);

const AudioContextProvider: React.FunctionComponent = ({ children }) => {
    const [audio, setAudio] = React.useState<HTMLAudioElement>(new Audio(lobbyMusic));
    const [permission, setPermissionGranted] = React.useState<boolean>(false);

    const handlePlayLobbyMusic = (p: boolean) => {
        if (p) {
            audio.play();
            audio.loop = true;
        }
    };

    const content = {
        permission,
        setPermissionGranted,
        playLobbyMusic: (p: boolean) => {
            if (p) {
                audio.play();
                audio.loop = true;
            }
        },
        pauseLobbyMusic: (p: boolean) => {
            if (p) {
                audio.pause();
            }
        },
    };
    return <AudioContext.Provider value={content}>{children}</AudioContext.Provider>;
};

export default AudioContextProvider;
