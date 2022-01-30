import React from 'react';

import { Game3Context, Topic } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { newPhotoTopicTypeGuard } from '../../../typeGuards/game3/newPhotoTopic';

interface Dependencies {
    setTopicMessage: (props: Topic) => void;
}

export const topicHandler = messageHandler(newPhotoTopicTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setTopicMessage({ topic: message.topic, countdownTime: message.countdownTime });
});

export const useTopicHandler = (socket: Socket, handler = topicHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setTopicMessage } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;

        const topicHandlerWithDependencies = handler({ setTopicMessage });

        topicHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
