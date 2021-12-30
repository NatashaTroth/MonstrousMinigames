import { History } from 'history';
import React from 'react';

import { Game3Context, Vote } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { controllerVoteRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { voteForPhotoMessageTypeGuard } from '../../../typeGuards/game3/voteForPhotos';

interface Dependencies {
    setVoteForPhotoMessage: (val: Vote) => void;
    history: History;
}

export const voteForPhotoHandler = messageHandler(
    voteForPhotoMessageTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setVoteForPhotoMessage({ photoUrls: message.photoUrls, countdownTime: message.countdownTime });
        dependencies.history.push(controllerVoteRoute(message.roomId));
    }
);

export const useVoteForPhotoHandler = (socket: Socket, handler = voteForPhotoHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setVoteForPhotoMessage } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;

        const voteForPhotoHandlerWithDependencies = handler({ setVoteForPhotoMessage, history });

        voteForPhotoHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setVoteForPhotoMessage, socket]);
};
