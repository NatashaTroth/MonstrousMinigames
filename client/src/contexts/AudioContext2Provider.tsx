import * as React from "react";

import campfireSoundsFile from "../assets/audio/Campfire_Loop.wav";
import lobbyMusicFile from "../assets/audio/LobbySound2_Loop.wav";
import owlSoundsFile from "../assets/audio/Owl_Loop.wav";
import finishedMusicFile from "../assets/audio/WinnerSound.wav";
import woodSoundsFile from "../assets/audio/WoodSounds_Loop.wav";

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

const lobbyTracks = [
    { src: lobbyMusicFile },
    { src: campfireSoundsFile, volumeFactor: 0.15 },
    { src: woodSoundsFile, volumeFactor: 0.3 },
];

type InitialTrack = { src: string; volumeFactor?: number };
type LoadedTrack = { gainNode: GainNode; volumeFactor?: number };
type PlayingTracks = { name: string; tracks: LoadedTrack[] };

export enum Sound {
    lobby = 'lobby',
    finished = 'finished',
    game = 'game',
}

export const defaultValue = {
    isPlaying: true,
    togglePlaying: () => {
        // do nothing
    },
    volume: 1,
    setVolume: () => {
        // do nothing
    },
    changeSound: () => {
        // do nothing
    },
};
interface AudioContext2Props {
    isPlaying: boolean;
    togglePlaying: () => void;
    volume: number;
    setVolume: (val: number) => void;
    changeSound: (val: Sound) => void;
}

export const AudioContext2 = React.createContext<AudioContext2Props>(defaultValue);

const AudioContext2Provider: React.FunctionComponent = ({ children }) => {
    const [volume, setVolume] = React.useState(
        localStorage.getItem('audioVolume') ? Number(localStorage.getItem('audioVolume')) : defaultValue.volume
    );
    const [audioCtx, setAudioCtx] = React.useState<null | AudioContext>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [lobbyMusic, setLobbyMusic] = React.useState<LoadedTrack[]>([]);
    const [finishdMusic, setFinishedMusic] = React.useState<LoadedTrack[]>([]);
    const [owlSounds, setOwlSounds] = React.useState<LoadedTrack[]>([]);
    const [playingTracks, setPlayingTracks] = React.useState<PlayingTracks>({ name: '', tracks: [] });

    React.useEffect(() => {
        window.addEventListener('click', () => initializeAudio(), { once: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function initializeAudio() {
        const context = new AudioContext();
        setAudioCtx(context);

        const lobby = loadTracks(lobbyTracks, context, volume, true, true);
        const finished = loadTracks([{ src: finishedMusicFile }], context, volume);
        const owlSounds = loadTracks([{ src: owlSoundsFile, volumeFactor: 0.15 }], context, volume);

        setLobbyMusic(lobby);
        setFinishedMusic(finished);
        setOwlSounds(owlSounds);

        setPlayingTracks({ name: Sound.lobby, tracks: lobby });
        setIsPlaying(true);
    }

    const stop = (tracksToStart: PlayingTracks, audioCtx: AudioContext | null) => {
        if (audioCtx) {
            tracksToStart.tracks.forEach(track => track.gainNode.disconnect(audioCtx.destination));
            setIsPlaying(false);
        }
    };

    const start = (tracksToStop: PlayingTracks, audioCtx: AudioContext | null) => {
        if (audioCtx) {
            tracksToStop.tracks.forEach(track => track.gainNode.connect(audioCtx.destination));
            setIsPlaying(true);
        }
    };

    const content = {
        isPlaying,
        togglePlaying: () => {
            if (isPlaying) {
                stop(playingTracks, audioCtx);
            } else {
                start(playingTracks, audioCtx);
            }
        },
        volume,
        setVolume: (value: number) => {
            playingTracks.tracks.forEach(
                track => (track.gainNode.gain.value = track.volumeFactor ? value + track.volumeFactor : value)
            );
            setVolume(value);
            localStorage.setItem('audioVolume', String(value));
        },
        changeSound: (sound: Sound) => {
            stop(playingTracks, audioCtx);
            let tracks;
            switch (sound) {
                case Sound.game:
                    tracks = { name: '', tracks: [] };
                    setPlayingTracks(tracks);
                    start(tracks, audioCtx);
                    return;
                case Sound.lobby:
                    tracks = { name: Sound.lobby, tracks: lobbyMusic };
                    setPlayingTracks(tracks);
                    start(tracks, audioCtx);
                    return;
                case Sound.finished:
                    tracks = { name: Sound.finished, tracks: finishdMusic };
                    setPlayingTracks(tracks);
                    start(tracks, audioCtx);
                    return;
            }
        },
        stop,
        start,
    };
    return <AudioContext2.Provider value={content}>{children}</AudioContext2.Provider>;
};

export default AudioContext2Provider;

// fetch music file and create audio buffer
async function loadFile(filePath: string, audioContext: AudioContext) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

// create trackSource to control audio
function playTrack(
    audioBuffer: AudioBuffer,
    audioContext: AudioContext,
    volume: number,
    volumeFactor: number,
    autoPlay: boolean,
    loop: boolean
) {
    const trackSource = audioContext.createBufferSource();
    // gainNode to modify audio (volume)
    const gainNode = audioContext.createGain();
    trackSource.buffer = audioBuffer;

    gainNode.gain.value = volume + volumeFactor;
    trackSource.connect(gainNode).connect(audioContext.destination);

    if (loop) {
        trackSource.loop = true;
    }

    if (autoPlay) {
        trackSource.start();
    }

    return { gainNode, volumeFactor };
}

// load buffer sources for all tracks
function loadTracks(tracks: InitialTrack[], audioCtx: AudioContext, volume: number, autoPlay = false, loop = false) {
    const loadedTracks: LoadedTrack[] = [];

    tracks.forEach(track => {
        loadFile(track.src, audioCtx).then(loadedTrack => {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const audio = playTrack(loadedTrack, audioCtx, volume, track.volumeFactor ?? 0, autoPlay, loop);

            if (audio) {
                loadedTracks.push(audio);
            }
        });
    });

    return loadedTracks;
}
