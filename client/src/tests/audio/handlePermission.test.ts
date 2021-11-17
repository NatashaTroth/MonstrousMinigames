import { handleAudioPermission } from '../../domain/audio/handlePermission';

describe('handlePermission function', () => {
    it('handed setAudioPermissionGranted should not be called if permissions already granted', () => {
        const setAudioPermissionGranted = jest.fn();

        handleAudioPermission(true, { setAudioPermissionGranted });

        expect(setAudioPermissionGranted).toHaveBeenCalledTimes(0);
    });
});
