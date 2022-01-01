import { Sound } from '../../contexts/AudioContextProvider';
import { initializeAudio, initializeTracks } from '../../domain/audio/initializeAudio';

afterEach(() => {
    jest.clearAllMocks();
});

describe('initializeAudio', () => {
    window.AudioContext = jest.fn().mockImplementation(() => {
        return {};
    });
    jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation();

    const dependencies = {
        volume: 0.5,
        setAudioCtx: jest.fn(),
        setFinishedMusic: jest.fn(),
        setGameThreeMusic: jest.fn(),
        setLobbyMusic: jest.fn(),
        setOwlMusic: jest.fn(),

        setIsPlaying: jest.fn(),
        setOwlSoundsTimeout: jest.fn(),
        owlMusic: [
            {
                src: new Audio(),
            },
        ],
        lobbyMusic: [],
        finishedMusic: [],
        gameThreeMusic: [],
        owlSoundsTimeout: setTimeout(() => {
            /*do nothing*/
        }, 0),
    };

    it('should set lobby music as initial music', () => {
        const setPlayingTracks = jest.fn();
        initializeAudio({ ...dependencies, setPlayingTracks });

        expect(setPlayingTracks).toHaveBeenCalledWith(expect.objectContaining({ name: Sound.lobby }));
    });
});

describe('initializeTracks', () => {
    window.AudioContext = jest.fn().mockImplementation(() => {
        return {};
    });

    const tracks = [
        {
            src: new Audio(),
        },
    ];

    it('should call track src loop when loop is true', () => {
        initializeTracks(tracks, 0.8, true);

        expect(tracks[0].src.loop).toEqual(true);
    });
});
