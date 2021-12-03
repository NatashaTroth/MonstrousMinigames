import { History } from "history";

import { PlayerRank } from "../../../contexts/ScreenSocketContextProvider";
import { controllerFinishedRoute } from "../../../utils/routes";
import messageHandler from "../../socket/messageHandler";
import { finishedTypeGuard } from "../../typeGuards/finished";

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
