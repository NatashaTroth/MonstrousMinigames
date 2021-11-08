import { handleAudioPermission } from './handlePermission';

describe('handlePermission function', () => {
    it('handed pauseLobbyMusic should not be called if permissions already granted', () => {
        const setAudioPermissionGranted = jest.fn();

        handleAudioPermission(true, { setAudioPermissionGranted });

        expect(setAudioPermissionGranted).toHaveBeenCalledTimes(0);
    });
});
