import { NewPhotoTopicMessage, newPhotoTopicTypeGuard } from '../../../domain/typeGuards/game3/newPhotoTopic';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('newPhotoTopic TypeGuard', () => {
    it('when type is newPhotoTopic, it should return true', () => {
        const data: NewPhotoTopicMessage = {
            type: MessageTypesGame3.newPhotoTopic,
            roomId: 'ASDF',
            topic: 'Tree',
            countdownTime: 30000,
        };

        expect(newPhotoTopicTypeGuard(data)).toEqual(true);
    });
});
