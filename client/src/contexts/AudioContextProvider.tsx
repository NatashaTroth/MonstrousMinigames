import * as React from 'react';

import campfireSoundsFile from '../assets/audio/Campfire_Loop.wav';
import gameThreeMusicFile from '../assets/audio/Game_3_Sound_Loop.wav';
import lobbyMusicFile from '../assets/audio/LobbySound2_Loop.wav';
import owlSoundsFile from '../assets/audio/Owl_Loop.wav';
import finishedMusicFile from '../assets/audio/WinnerSound.wav';
import woodSoundsFile from '../assets/audio/WoodSounds_Loop.wav';

interface WindowProps extends Window {
    webkitAudioContext?: typeof AudioContext;
}

const lobbyTracks = [
    { src: new Audio(lobbyMusicFile) },
    { src: new Audio(campfireSoundsFile), volumeFactor: 0.15 },
    { src: new Audio(woodSoundsFile), volumeFactor: 0.3 },
];
const owlTracks = [{ src: new Audio(owlSoundsFile), volumeFactor: 0.15 }];
const finishedTracks = [{ src: new Audio(finishedMusicFile) }];
const gameThreeTracks = [{ src: new Audio(gameThreeMusicFile) }];

type Track = { src: HTMLAudioElement; volumeFactor?: number; onPlay?: () => Promise<void> };
type PlayingTracks = { name: string; tracks: Track[] };

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
        window.addEventListener('click', () => initializeAudio(), { once: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function initializeAudio() {
        const w = window as WindowProps;
        const AudioContext = window.AudioContext || w.webkitAudioContext;

        const context = new AudioContext();
        setAudioCtx(context);

        const lobby = initializeTracks(lobbyMusic, volume, true);
        const owl = initializeTracks(owlMusic, volume);
        const finished = initializeTracks(finishedMusic, volume);
        const gameThree = initializeTracks(gameThreeMusic, volume, true);

        owl[0].onPlay = playOwlSounds;

        setLobbyMusic(lobby);
        setOwlMusic(owl);
        setFinishedMusic(finished);
        setGameThreeMusic(gameThree);

        const initialMusic = { name: Sound.lobby, tracks: [...lobby, ...owl] };
        setPlayingTracks(initialMusic);

        play({ playingTracks: initialMusic, audioCtx: context, setIsPlaying });
    }

    const playOwlSounds = async () => {
        await owlMusic[0].src.play();
        clearTimeout(owlSoundsTimeout);
        const timeout = setTimeout(playOwlSounds, getTimeForNextOwlSound());
        setOwlSoundsTimeout(timeout);
    };

    const getTimeForNextOwlSound = () => {
        return Math.random() * 30000;
    };

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

function initializeTracks(tracks: Track[], volume: number, loop = false) {
    return tracks.map(track => {
        changeVolume(tracks, volume);

        if (loop) {
            track.src.loop = true;
        }
        return track;
    });
}

function changeVolume(tracks: Track[], volume: number) {
    return tracks.map(track => {
        if (volume + (track.volumeFactor ?? 0) > 1) {
            track.src.volume = 1;
        } else {
            track.src.volume = volume + (track.volumeFactor ?? 0);
        }

        return track;
    });
}

interface PlayProps {
    playingTracks: PlayingTracks;
    audioCtx: AudioContext | null;
    setIsPlaying: (val: boolean) => void;
}

const play = ({ playingTracks, audioCtx, setIsPlaying }: PlayProps) => {
    if (audioCtx) {
        playingTracks.tracks.forEach(track => {
            if (track.onPlay) {
                track.onPlay();
            } else {
                track.src.play();
            }
        });
        setIsPlaying(true);
        localStorage.setItem('playingMusic', 'true');
    }
};

interface PauseProps extends PlayProps {
    owlSoundsTimeout: ReturnType<typeof setTimeout>;
}

const pause = ({ playingTracks, audioCtx, setIsPlaying, owlSoundsTimeout }: PauseProps) => {
    if (audioCtx) {
        playingTracks.tracks.forEach(track => track.src.pause());
        clearTimeout(owlSoundsTimeout);
        setIsPlaying(false);
        localStorage.setItem('playingMusic', 'false');
    }
};

interface ChangeSoundDependencies {
    pause: (props: PauseProps) => void;
    play: (props: PlayProps) => void;
    setPlayingTracks: (val: PlayingTracks) => void;
    playingTracks: PlayingTracks;
    audioCtx: AudioContext | null;
    lobbyMusic: Track[];
    finishedMusic: Track[];
    owlMusic: Track[];
    gameThreeMusic: Track[];
    volume: number;
    isPlaying: boolean;
    setIsPlaying: (val: boolean) => void;
    owlSoundsTimeout: ReturnType<typeof setTimeout>;
}

function changeSound(dependencies: ChangeSoundDependencies) {
    return (sound: Sound) => {
        const {
            pause,
            play,
            setPlayingTracks,
            audioCtx,
            playingTracks,
            lobbyMusic,
            finishedMusic,
            volume,
            isPlaying,
            setIsPlaying,
            owlSoundsTimeout,
            owlMusic,
            gameThreeMusic,
        } = dependencies;

        if (playingTracks.name === sound) {
            return;
        }

        const currentlyPlaying = isPlaying;
        pause({ playingTracks, audioCtx, setIsPlaying, owlSoundsTimeout });

        let tracks: PlayingTracks = { name: '', tracks: [] };

        if (sound === Sound.lobby) {
            tracks = { name: Sound.lobby, tracks: [...lobbyMusic, ...owlMusic] };
        } else if (sound === Sound.finished) {
            tracks = { name: Sound.finished, tracks: finishedMusic };
        } else if (sound === Sound.game3) {
            tracks = { name: Sound.game3, tracks: gameThreeMusic };
        }

        changeVolume(tracks.tracks, volume);
        setPlayingTracks(tracks);

        if (currentlyPlaying) {
            play({ playingTracks: tracks, audioCtx, setIsPlaying });
        }
    };
}
