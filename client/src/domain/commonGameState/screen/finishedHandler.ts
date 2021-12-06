import { History } from 'history';

import { PlayerRank } from '../../../contexts/ScreenSocketContextProvider';
import { screenFinishedRoute } from '../../../utils/routes';
import messageHandler from '../../socket/messageHandler';
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
