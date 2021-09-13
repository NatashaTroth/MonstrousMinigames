import { History } from 'history';

import { PlayerRank } from '../../../contexts/ScreenSocketContextProvider';
import { controllerFinishedRoute } from '../../../utils/routes';

interface HandleGameHasFinishedMessage {
    roomId: string;
    playerRank: undefined | number;
    playerRanks: PlayerRank[];
    dependencies: {
        setPlayerRank: (val: number) => void;
    };
    history: History;
}
export const handleGameHasFinishedMessage = (props: HandleGameHasFinishedMessage) => {
    const { roomId, playerRank, playerRanks, dependencies, history } = props;
    const stoneTimeoutId = sessionStorage.getItem('stoneTimeoutId');

    if (stoneTimeoutId) {
        clearTimeout(Number(stoneTimeoutId));
        sessionStorage.removeItem('stoneTimeoutId');
    }

    if (!playerRank) {
        const userId = sessionStorage.getItem('userId');
        const rank = playerRanks.find(rankItem => rankItem.id === userId);

        if (rank && rank.rank) {
            dependencies.setPlayerRank(rank.rank);
        }
    }

    history.push(controllerFinishedRoute(roomId));
};
