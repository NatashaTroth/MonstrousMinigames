import { topicHandler } from '../../../domain/game3/controller/gameState/topicHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { NewPhotoTopicMessage } from '../../../domain/typeGuards/game3/newPhotoTopic';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('topicHandler', () => {
    const roomId = 'ANES';
    const message: NewPhotoTopicMessage = {
        type: MessageTypesGame3.newPhotoTopic,
        roomId,
        countdownTime: 3000,
        topic: 'random',
    };

    it('when NewPhotoTopicMessage is written, setTopicMessage should be called', async () => {
        const setTopicMessage = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = topicHandler({ setTopicMessage });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setTopicMessage).toHaveBeenCalledTimes(1);
    });
});
