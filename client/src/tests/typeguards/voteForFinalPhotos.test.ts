import {
    VoteForFinalPhotosMessage, voteForFinalPhotosMessageTypeGuard
} from '../../domain/typeGuards/game3/voteForFinalPhotos';
import { MessageTypesGame3 } from '../../utils/constants';

describe('voteForFinalPhotos TypeGuard', () => {
    it('when type is voteForFinalPhotos, it should return true', () => {
        const data: VoteForFinalPhotosMessage = {
            type: MessageTypesGame3.voteForFinalPhotos,
            roomId: 'ADGS',
            countdownTime: 3000,
            photographers: [],
        };

        expect(voteForFinalPhotosMessageTypeGuard(data)).toEqual(true);
    });
});
