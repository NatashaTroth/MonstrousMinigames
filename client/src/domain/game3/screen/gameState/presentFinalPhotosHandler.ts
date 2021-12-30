import React from 'react';

import { FinalPhoto, Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { presentFinalPhotosTypeGuard } from '../../../typeGuards/game3/presentFinalPhotos';

interface Dependencies {
    setPresentFinalPhotos: (val: FinalPhoto) => void;
}

export const presentFinalPhotosHandler = messageHandler(
    presentFinalPhotosTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setPresentFinalPhotos({
            photographerId: message.photographerId,
            name: message.name,
            photoUrls: message.photoUrls,
            countdownTime: message.countdownTime,
        });
    }
);

export const usePresentFinalPhotosHandler = (socket: Socket, handler = presentFinalPhotosHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setPresentFinalPhotos } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;

        const presentFinalPhotosHandlerWithDependencies = handler({ setPresentFinalPhotos });

        presentFinalPhotosHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setPresentFinalPhotos, socket]);
};
