import { History } from 'history';
import React from 'react';

import { Game3Context, Vote } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { controllerVoteRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { voteForFinalPhotosMessageTypeGuard } from '../../../typeGuards/game3/voteForFinalPhotos';

interface Dependencies {
    setVoteForPhotoMessage: (val: Vote) => void;
    history: History;
}

export const voteForFinalPhotosHandler = messageHandler(
    voteForFinalPhotosMessageTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setVoteForPhotoMessage({
            photographers: message.photographers,
            countdownTime: message.countdownTime,
        });
        dependencies.history.push(controllerVoteRoute(message.roomId));
    }
);

export const useVoteForFinalPhotosHandler = (socket: Socket, handler = voteForFinalPhotosHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setVoteForPhotoMessage } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;

        const voteForFinalPhotosHandlerWithDependencies = handler({
            setVoteForPhotoMessage,
            history,
        });

        voteForFinalPhotosHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
