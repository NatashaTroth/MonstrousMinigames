import { PlayingTracks, Sound, Track } from '../../contexts/AudioContextProvider';

export async function playOwlSounds(
    owlMusic: Track[],
    owlSoundsTimeout: ReturnType<typeof setTimeout>,
    setOwlSoundsTimeout: (timeout: ReturnType<typeof setTimeout>) => void
): Promise<void> {
    await owlMusic[0].src.play();
    clearTimeout(owlSoundsTimeout);
    const timeout = setTimeout(() => playOwlSounds, Math.random() * 30000);
    setOwlSoundsTimeout(timeout);
}

export function changeVolume(tracks: Track[], volume: number) {
    return tracks.map(track => {
        if (volume + (track.volumeFactor ?? 0) > 1 || volume > 1) {
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

export const play = ({ playingTracks, audioCtx, setIsPlaying }: PlayProps) => {
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

export const pause = ({ playingTracks, audioCtx, setIsPlaying, owlSoundsTimeout }: PauseProps) => {
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
    gameOneMusic: Track[];
    gameTwoMusic: Track[];
    gameThreeMusic: Track[];
    volume: number;
    isPlaying: boolean;
    setIsPlaying: (val: boolean) => void;
    owlSoundsTimeout: ReturnType<typeof setTimeout>;
}

export function changeSound(dependencies: ChangeSoundDependencies) {
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
            gameOneMusic,
            gameTwoMusic,
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
        } else if (sound === Sound.game1) {
            tracks = { name: Sound.game1, tracks: gameOneMusic };
        } else if (sound === Sound.game2) {
            tracks = { name: Sound.game2, tracks: gameTwoMusic };
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
