import React from 'react';

import { FinalPhoto, Game3Context, Vote } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { voteForFinalPhotosMessageTypeGuard } from '../../../typeGuards/game3/voteForFinalPhotos';

interface Dependencies {
    setVoteForPhotoMessage: (val: Vote) => void;
    setPresentFinalPhotos: (val: FinalPhoto) => void;
}

export const voteForFinalPhotosHandler = messageHandler(
    voteForFinalPhotosMessageTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setPresentFinalPhotos(undefined);
        dependencies.setVoteForPhotoMessage({
            photographers: message.photographers,
            countdownTime: message.countdownTime,
        });
    }
);

export const useVoteForFinalPhotosHandler = (socket: Socket, handler = voteForFinalPhotosHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setVoteForPhotoMessage, setPresentFinalPhotos } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;

        const voteForFinalPhotosHandlerWithDependencies = handler({
            setPresentFinalPhotos,
            setVoteForPhotoMessage,
        });
        voteForFinalPhotosHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setPresentFinalPhotos, setVoteForPhotoMessage, socket]);
};
