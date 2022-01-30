import { play } from '../../../domain/audio/handleAudio';

afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
});

describe('play', () => {
    window.AudioContext = jest.fn().mockImplementation(() => {
        return {};
    });

    jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation();

    const audioCtx = new AudioContext();
    const setIsPlaying = jest.fn();

    it('should save playingMusic to localStorage', () => {
        const playingTracks = {
            name: 'lobby',
            tracks: [
                {
                    src: new Audio(),
                },
            ],
        };

        play({ playingTracks, setIsPlaying, audioCtx });

        expect(localStorage.getItem('playingMusic')).toEqual('true');
    });
});
