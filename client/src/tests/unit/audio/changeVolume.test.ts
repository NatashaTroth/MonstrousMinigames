import { changeVolume } from '../../../domain/audio/handleAudio';

afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
});

describe('changeVolume', () => {
    it('should update volume of tracks', () => {
        const volume = 0.6;
        const tracks = [{ src: new Audio() }];
        changeVolume(tracks, volume);

        expect(tracks[0].src.volume).toEqual(volume);
    });

    it('should handle max volume of 1', () => {
        const volume = 0.6;
        const tracks = [{ src: new Audio(), volumeFactor: 2 }];
        changeVolume(tracks, volume);

        expect(tracks[0].src.volume).toEqual(1);
    });
});
