import { History } from 'history';
import React from 'react';

import { FinalPhoto, Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { controllerPresentRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { presentFinalPhotosTypeGuard } from '../../../typeGuards/game3/presentFinalPhotos';

interface Dependencies {
    setPresentFinalPhotos: (val: FinalPhoto) => void;
    history: History;
}
export const presentFinalPhotosHandler = messageHandler(
    presentFinalPhotosTypeGuard,
    (message, dependencies: Dependencies) => {
        const { photographerId, name, photoUrls, countdownTime, roomId } = message;

        dependencies.setPresentFinalPhotos({
            photographerId: photographerId,
            name: name,
            photoUrls: photoUrls,
            countdownTime: countdownTime,
        });
        dependencies.history.push(controllerPresentRoute(roomId));
    }
);

export const usePresentFinalPhotosHandler = (socket: Socket, handler = presentFinalPhotosHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setPresentFinalPhotos } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;

        const presentFinalPhotosHandlerWithDependencies = handler({ setPresentFinalPhotos, history });
        presentFinalPhotosHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setPresentFinalPhotos, socket]);
};
