import { playOwlSounds } from '../../domain/audio/handleAudio';

afterAll(() => {
    jest.clearAllMocks();
});
describe('playOwlSounds', () => {
    jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation();

    it('should set new timeout', async () => {
        const owlMusic = [{ src: new Audio() }];
        const setOwlSoundsTimeout = jest.fn();

        await playOwlSounds(
            owlMusic,
            setTimeout(() => {
                /*do nothing*/
            }, 0),
            setOwlSoundsTimeout
        );

        expect(setOwlSoundsTimeout).toHaveBeenCalledTimes(1);
    });
});
