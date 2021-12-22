import { PlayingTracks, Sound, Track } from '../../contexts/AudioContextProvider';
import { changeVolume, play, playOwlSounds } from './handleAudio';

interface WindowProps extends Window {
    webkitAudioContext?: typeof AudioContext;
}

interface InitializeAudioProps {
    volume: number;
    lobbyMusic: Track[];
    owlMusic: Track[];
    finishedMusic: Track[];
    gameThreeMusic: Track[];
    owlSoundsTimeout: ReturnType<typeof setTimeout>;
    setAudioCtx: (val: null | AudioContext) => void;
    setLobbyMusic: (val: Track[]) => void;
    setOwlMusic: (val: Track[]) => void;
    setFinishedMusic: (val: Track[]) => void;
    setGameThreeMusic: (val: Track[]) => void;
    setPlayingTracks: (val: PlayingTracks) => void;
    setIsPlaying: (val: boolean) => void;
    setOwlSoundsTimeout: (val: ReturnType<typeof setTimeout>) => void;
}

export async function initializeAudio({
    volume,
    setAudioCtx,
    setFinishedMusic,
    setGameThreeMusic,
    setLobbyMusic,
    setOwlMusic,
    setPlayingTracks,
    setIsPlaying,
    setOwlSoundsTimeout,
    owlMusic,
    lobbyMusic,
    finishedMusic,
    gameThreeMusic,
    owlSoundsTimeout,
}: InitializeAudioProps) {
    const w = window as WindowProps;
    const AudioContext = window.AudioContext || w.webkitAudioContext;

    const context = new AudioContext();
    setAudioCtx(context);

    const lobby = initializeTracks(lobbyMusic, volume, true);
    const owl = initializeTracks(owlMusic, volume);
    const finished = initializeTracks(finishedMusic, volume);
    const gameThree = initializeTracks(gameThreeMusic, volume, true);

    owl[0].onPlay = () => playOwlSounds(owlMusic, owlSoundsTimeout, setOwlSoundsTimeout);

    setLobbyMusic(lobby);
    setOwlMusic(owl);
    setFinishedMusic(finished);
    setGameThreeMusic(gameThree);

    const initialMusic = { name: Sound.lobby, tracks: [...lobby, ...owl] };
    setPlayingTracks(initialMusic);

    play({ playingTracks: initialMusic, audioCtx: context, setIsPlaying });
}

export function initializeTracks(tracks: Track[], volume: number, loop = false) {
    return tracks.map(track => {
        changeVolume(tracks, volume);

        if (loop) {
            track.src.loop = true;
        }
        return track;
    });
}
