import { handleAudio } from '../../domain/audio/handleAudio';

describe('handleAudio function', () => {
    it('handed pauseLobbyMusic should be called', () => {
        const pauseLobbyMusic = jest.fn();
        const playLobbyMusic = jest.fn();
        const setAudioPermissionGranted = jest.fn();

        handleAudio({
            playing: true,
            audioPermission: false,
            pauseLobbyMusic,
            playLobbyMusic,
            setAudioPermissionGranted,
        });

        expect(pauseLobbyMusic).toHaveBeenCalledTimes(1);
    });

    it('handed playLobbyMusic should be called', () => {
        const pauseLobbyMusic = jest.fn();
        const playLobbyMusic = jest.fn();
        const setAudioPermissionGranted = jest.fn();

        handleAudio({
            playing: false,
            audioPermission: false,
            pauseLobbyMusic,
            playLobbyMusic,
            setAudioPermissionGranted,
        });

        expect(playLobbyMusic).toHaveBeenCalledTimes(1);
    });
});
