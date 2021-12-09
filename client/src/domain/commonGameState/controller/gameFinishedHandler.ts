import { History } from 'history';
import React from 'react';

import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import { PlayerRank } from '../../../contexts/ScreenSocketContextProvider';
import { controllerFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { finishedTypeGuard } from '../../typeGuards/finished';

interface Dependencies {
    setPlayerRank: (val: number) => void;
    playerRank: undefined | number;
    history: History;
}
export interface HandleGameHasFinishedMessageData {
    roomId: string;
    playerRanks: PlayerRank[];
}

export const gameFinishedHandler = messageHandler(finishedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    const { playerRank, history, setPlayerRank } = dependencies;

    const windmillTimeoutId = sessionStorage.getItem('windmillTimeoutId');

    if (windmillTimeoutId) {
        clearTimeout(Number(windmillTimeoutId));
        sessionStorage.removeItem('windmillTimeoutId');
    }

    if (!playerRank) {
        const userId = sessionStorage.getItem('userId');
        const rank = message.data.playerRanks.find(rankItem => rankItem.id === userId);

        if (rank && rank.rank) {
            setPlayerRank(rank.rank);
        }
    }

    history.push(controllerFinishedRoute(roomId));
});

export const useGameFinishedHandler = (socket: Socket, handler = gameFinishedHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setPlayerRank, playerRank } = React.useContext(PlayerContext);

    React.useEffect(() => {
        if (!roomId) return;

        const gameFinishedHandlerWithDependencies = handler({ setPlayerRank, history, playerRank });

        gameFinishedHandlerWithDependencies(socket, roomId);
    }, [handler, playerRank, roomId, setPlayerRank, socket]);
};
