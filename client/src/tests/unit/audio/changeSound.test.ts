import { Sound, Track } from '../../../contexts/AudioContextProvider';
import { changeSound } from '../../../domain/audio/handleAudio';

afterEach(() => {
    jest.clearAllMocks();
});

describe('changeSound', () => {
    window.AudioContext = jest.fn().mockImplementation(() => {
        return {};
    });

    const lobbyMusic: Track[] = [];
    const owlMusic: Track[] = [];
    const finishedMusic: Track[] = [];
    const gameThreeMusic: Track[] = [];
    const gameOneMusic: Track[] = [];
    const gameTwoMusic: Track[] = [];

    const dependencies = {
        pause: jest.fn(),
        play: jest.fn(),
        audioCtx: new AudioContext(),
        playingTracks: {
            name: Sound.lobby,
            tracks: [],
        },
        lobbyMusic,
        finishedMusic,
        volume: 0.5,
        isPlaying: true,
        setIsPlaying: jest.fn(),
        owlSoundsTimeout: setTimeout(() => {
            /*do nothing*/
        }, 0),
        owlMusic,
        gameOneMusic,
        gameTwoMusic,
        gameThreeMusic,
    };

    it('should update playing tracks', () => {
        const setPlayingTracks = jest.fn();
        const withDependencies = changeSound({ ...dependencies, setPlayingTracks });

        withDependencies(Sound.game1);

        expect(setPlayingTracks).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when sound is the same', () => {
        const setPlayingTracks = jest.fn();
        const withDependencies = changeSound({ ...dependencies, setPlayingTracks });

        withDependencies(Sound.lobby);

        expect(setPlayingTracks).toHaveBeenCalledTimes(0);
    });

    it('should set game music after lobby', () => {
        const setPlayingTracks = jest.fn();
        const playingTracks = {
            name: Sound.lobby,
            tracks: [],
        };
        const withDependencies = changeSound({ ...dependencies, setPlayingTracks, playingTracks });

        withDependencies(Sound.game3);

        expect(setPlayingTracks).toHaveBeenCalledWith(expect.objectContaining({ name: Sound.game3 }));
    });

    it('should set lobby music after finished', () => {
        const setPlayingTracks = jest.fn();
        const playingTracks = {
            name: Sound.finished,
            tracks: [],
        };
        const withDependencies = changeSound({ ...dependencies, setPlayingTracks, playingTracks });

        withDependencies(Sound.lobby);

        expect(setPlayingTracks).toHaveBeenCalledWith(expect.objectContaining({ name: Sound.lobby }));
    });

    it('should set finished music after game', () => {
        const setPlayingTracks = jest.fn();
        const playingTracks = {
            name: Sound.game3,
            tracks: [],
        };
        const withDependencies = changeSound({ ...dependencies, setPlayingTracks, playingTracks });

        withDependencies(Sound.finished);

        expect(setPlayingTracks).toHaveBeenCalledWith(expect.objectContaining({ name: Sound.finished }));
    });
});
