import * as React from 'react';

import campfireSoundsFile from '../assets/audio/Campfire_Loop.wav';
import gameThreeMusicFile from '../assets/audio/Game_3_Sound_Loop.wav';
import lobbyMusicFile from '../assets/audio/LobbySound2_Loop.wav';
import owlSoundsFile from '../assets/audio/Owl_Loop.wav';
import finishedMusicFile from '../assets/audio/WinnerSound.wav';
import woodSoundsFile from '../assets/audio/WoodSounds_Loop.wav';
import { changeSound, changeVolume, pause, play } from '../domain/audio/handleAudio';
import { initializeAudio } from '../domain/audio/initializeAudio';

const lobbyTracks = [
    { src: new Audio(lobbyMusicFile) },
    { src: new Audio(campfireSoundsFile), volumeFactor: 0.15 },
    { src: new Audio(woodSoundsFile), volumeFactor: 0.3 },
];
const owlTracks = [{ src: new Audio(owlSoundsFile), volumeFactor: 0.15 }];
const finishedTracks = [{ src: new Audio(finishedMusicFile) }];
const gameThreeTracks = [{ src: new Audio(gameThreeMusicFile) }];

export type Track = { src: HTMLAudioElement; volumeFactor?: number; onPlay?: () => Promise<void> };
export type PlayingTracks = { name: string; tracks: Track[] };

export enum Sound {
    lobby = 'lobby',
    finished = 'finished',
    game1 = 'game1',
    game2 = 'game2',
    game3 = 'game3',
}

export const defaultValue = {
    isPlaying: true,
    togglePlaying: () => {
        // do nothing
    },
    volume: 0.5,
    setVolume: () => {
        // do nothing
    },
    changeSound: () => {
        // do nothing
    },
};
interface MyAudioContextProps {
    isPlaying: boolean;
    togglePlaying: () => void;
    volume: number;
    setVolume: (val: number) => void;
    changeSound: (val: Sound) => void;
}

export const MyAudioContext = React.createContext<MyAudioContextProps>(defaultValue);

const MyAudioContextProvider: React.FunctionComponent = ({ children }) => {
    const [volume, setVolume] = React.useState(
        localStorage.getItem('audioVolume') ? Number(localStorage.getItem('audioVolume')) : defaultValue.volume
    );
    const [audioCtx, setAudioCtx] = React.useState<null | AudioContext>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);

    const [lobbyMusic, setLobbyMusic] = React.useState<Track[]>(lobbyTracks);
    const [finishedMusic, setFinishedMusic] = React.useState<Track[]>(finishedTracks);
    const [owlMusic, setOwlMusic] = React.useState<Track[]>(owlTracks);
    const [gameThreeMusic, setGameThreeMusic] = React.useState<Track[]>(gameThreeTracks);

    const [playingTracks, setPlayingTracks] = React.useState<PlayingTracks>({ name: '', tracks: [] });
    const [owlSoundsTimeout, setOwlSoundsTimeout] = React.useState<ReturnType<typeof setTimeout>>(
        setTimeout(() => {
            /*do nothing*/
        }, 0)
    );

    React.useEffect(() => {
        window.addEventListener(
            'click',
            () =>
                initializeAudio({
                    volume,
                    setAudioCtx,
                    setFinishedMusic,
                    setGameThreeMusic,
                    setLobbyMusic,
                    setOwlMusic,
                    setPlayingTracks,
                    setOwlSoundsTimeout,
                    setIsPlaying,
                    lobbyMusic,
                    owlMusic,
                    owlSoundsTimeout,
                    finishedMusic,
                    gameThreeMusic,
                }),
            { once: true }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const content = {
        isPlaying,
        togglePlaying: () => {
            isPlaying
                ? pause({ playingTracks, audioCtx, setIsPlaying, owlSoundsTimeout })
                : play({ playingTracks, audioCtx, setIsPlaying });
        },
        volume,
        setVolume: (value: number) => {
            changeVolume(playingTracks.tracks, value);
            setVolume(value);
            localStorage.setItem('audioVolume', String(value));
        },
        changeSound: changeSound({
            isPlaying,
            play,
            playingTracks,
            setPlayingTracks,
            finishedMusic,
            lobbyMusic,
            pause,
            volume,
            audioCtx,
            setIsPlaying,
            owlSoundsTimeout,
            owlMusic,
            gameThreeMusic,
        }),
    };
    return <MyAudioContext.Provider value={content}>{children}</MyAudioContext.Provider>;
};

export default MyAudioContextProvider;
