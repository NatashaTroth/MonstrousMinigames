import { History } from 'history';

import { PlayerRank } from '../../../contexts/ScreenSocketContextProvider';
import { controllerFinishedRoute } from '../../../utils/routes';

interface Dependencies {
    setPlayerRank: (val: number) => void;
    playerRank: undefined | number;
    history: History;
}
export interface HandleGameHasFinishedMessageData {
    roomId: string;
    playerRanks: PlayerRank[];
}

export const handleGameHasFinishedMessage = (dependencies: Dependencies) => {
    return (data: HandleGameHasFinishedMessageData) => {
        const { roomId, playerRanks } = data;
        const { playerRank, history, setPlayerRank } = dependencies;

        const windmillTimeoutId = sessionStorage.getItem('windmillTimeoutId');

        if (windmillTimeoutId) {
            clearTimeout(Number(windmillTimeoutId));
            sessionStorage.removeItem('windmillTimeoutId');
        }

        if (!playerRank) {
            const userId = sessionStorage.getItem('userId');
            const rank = playerRanks.find(rankItem => rankItem.id === userId);

            if (rank && rank.rank) {
                setPlayerRank(rank.rank);
            }
        }

        history.push(controllerFinishedRoute(roomId));
    };
};
