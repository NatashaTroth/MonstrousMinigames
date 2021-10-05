import { MessageTypesGame3 } from "../../../utils/constants";
import { NewPhotoTopicMessage, newPhotoTopicTypeGuard } from "./newPhotoTopic";

describe('newPhotoTopic TypeGuard', () => {
    it('when type is newPhotoTopic, it should return true', () => {
        const data: NewPhotoTopicMessage = {
            type: MessageTypesGame3.newPhotoTopic,
            topic: 'Tree',
            countdownTime: 30000,
        };

        expect(newPhotoTopicTypeGuard(data)).toEqual(true);
    });
});
