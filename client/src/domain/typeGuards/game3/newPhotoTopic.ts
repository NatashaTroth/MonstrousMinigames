import { MessageTypesGame3 } from '../../../utils/constants';
import { MessageDataGame3 } from './MessageDataGame3';

export interface NewPhotoTopicMessage {
    type: MessageTypesGame3.newPhotoTopic;
    topic: string;
    countdownTime: number;
}

export const newPhotoTopicTypeGuard = (data: MessageDataGame3): data is NewPhotoTopicMessage => {
    return (data as NewPhotoTopicMessage).type === MessageTypesGame3.newPhotoTopic;
};
