import { Topic } from '../../../../contexts/game3/Game3ContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { newPhotoTopicTypeGuard } from '../../../typeGuards/game3/newPhotoTopic';

interface Dependencies {
    setTopicMessage: (props: Topic) => void;
}

export const topicHandler = messageHandler(newPhotoTopicTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setTopicMessage({ topic: message.topic, countdownTime: message.countdownTime });
});
