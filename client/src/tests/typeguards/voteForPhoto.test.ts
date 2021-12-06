import { VoteForPhotoMessage, voteForPhotoMessageTypeGuard } from '../../domain/typeGuards/game3/voteForPhotos';
import { MessageTypesGame3 } from '../../utils/constants';

describe('voteForPhoto TypeGuard', () => {
    it('when type is voteForPhoto, it should return true', () => {
        const data: VoteForPhotoMessage = {
            type: MessageTypesGame3.voteForPhotos,
            roomId: 'ADGS',
            countdownTime: 3000,
            photoUrls: [],
        };

        expect(voteForPhotoMessageTypeGuard(data)).toEqual(true);
    });
});
