import { pause } from '../../domain/audio/handleAudio';

afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
});

describe('pause', () => {
    window.AudioContext = jest.fn().mockImplementation(() => {
        return {};
    });

    const playingTracks = {
        name: 'lobby',
        tracks: [],
    };
    const audioCtx = new AudioContext();
    const setIsPlaying = jest.fn();

    it('should save playingMusic to localStorage', () => {
        pause({
            playingTracks,
            setIsPlaying,
            audioCtx,
            owlSoundsTimeout: setTimeout(() => {
                /*do nothing*/
            }, 0),
        });

        expect(localStorage.getItem('playingMusic')).toEqual('false');
    });
});
