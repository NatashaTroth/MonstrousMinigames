import * as React from 'react';

import lobbyMusic from '../assets/audio/Lobby_Sound.wav';

export const defaultValue = {
    playLobbyMusic: () => {
        //do nothing
    },
    pauseLobbyMusic: () => {
        //do nothing
    },
    // audio: new Audio(lobbyMusic),

    // setAudio: () => {
    //     // do nothing
    // },
};
interface IAudioContext {
    playLobbyMusic: () => void;
    pauseLobbyMusic: () => void;
    // setAudio: (val: HTMLAudioElement) => void;
}

export const AudioContext = React.createContext<IAudioContext>(defaultValue);

const AudioContextProvider: React.FunctionComponent = ({ children }) => {
    const [audio, setAudio] = React.useState<HTMLAudioElement>(new Audio(lobbyMusic));

    const content = {
        playLobbyMusic: () => {
            audio.play();
            audio.loop = true;
        },
        pauseLobbyMusic: () => {
            audio.pause();
        },

        // setAudio,
        // : (val: HTMLAudioElement) => {
        //     //eslint-disable-next-line no-console
        //     console.log('hiii');
        //     setAudio(val);
        // },
    };
    return <AudioContext.Provider value={content}>{children}</AudioContext.Provider>;
};

export default AudioContextProvider;
