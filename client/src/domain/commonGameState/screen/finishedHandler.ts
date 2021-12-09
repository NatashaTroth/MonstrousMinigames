import { History } from 'history';
import React from 'react';

import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerRank } from '../../../contexts/screen/ScreenSocketContextProvider';
import { screenFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { finishedTypeGuard } from '../../typeGuards/finished';

interface Dependencies {
    setFinished: (val: boolean) => void;
    setPlayerRanks: (val: PlayerRank[]) => void;
    history: History;
}

export const finishedHandler = messageHandler(finishedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    const { setFinished, setPlayerRanks, history } = dependencies;
    setFinished(true);
    setPlayerRanks(message.data.playerRanks);
    history.push(screenFinishedRoute(roomId));
});

export const useFinishedHandler = (socket: Socket, handler = finishedHandler) => {
    const { roomId, setFinished, setPlayerRanks } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const finishedHandlerWithDependencies = handler({ setFinished, setPlayerRanks, history });
        finishedHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setFinished, setPlayerRanks, socket]);
};
