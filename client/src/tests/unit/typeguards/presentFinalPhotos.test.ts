import {
    PresentFinalPhotosMessage,
    presentFinalPhotosTypeGuard,
} from '../../../domain/typeGuards/game3/presentFinalPhotos';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('presentFinalPhotos TypeGuard', () => {
    it('when type is presentFinalPhotos, it should return true', () => {
        const data: PresentFinalPhotosMessage = {
            type: MessageTypesGame3.presentFinalPhotos,
            roomId: 'ADGS',
            countdownTime: 3000,
            photoUrls: [],
            photographerId: 'adas',
            name: 'mock',
        };

        expect(presentFinalPhotosTypeGuard(data)).toEqual(true);
    });
});
