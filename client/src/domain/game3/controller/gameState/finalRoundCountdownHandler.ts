import React from 'react';

import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { finalRoundCountdownTypeGuard } from '../../../typeGuards/game3/finalRoundCountdown';

interface Dependencies {
    setFinalRoundCountdownTime: (time: number) => void;
    setFinalRoundPhotoTopics: (topics: string[]) => void;
}

export const finalRoundCountdownHandler = messageHandler(
    finalRoundCountdownTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setFinalRoundCountdownTime(message.countdownTime);
        dependencies.setFinalRoundPhotoTopics(message.photoTopics);
    }
);

export const useFinalRoundCountdownHandler = (socket: Socket, handler = finalRoundCountdownHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setFinalRoundCountdownTime, setFinalRoundPhotoTopics } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;

        const finalRoundCountdownHandlerWithDependencies = handler({
            setFinalRoundCountdownTime,
            setFinalRoundPhotoTopics,
        });
        finalRoundCountdownHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setFinalRoundCountdownTime, setFinalRoundPhotoTopics, socket]);
};
