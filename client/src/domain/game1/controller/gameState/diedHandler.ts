import { controllerPlayerDeadRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { PlayerDiedMessage, playerDiedTypeGuard } from '../../../typeGuards/game1/playerDied';

interface Dependencies {
    setPlayerDead: (val: boolean) => void;
    setPlayerRank: (val: number) => void;
}
export interface HandlePlayerDiedProps {
    data: PlayerDiedMessage;
    roomId: string;
}

export const diedHandler = messageHandler(playerDiedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    const { setPlayerDead, setPlayerRank } = dependencies;

    setPlayerDead(true);
    setPlayerRank(message.rank);
    history.push(controllerPlayerDeadRoute(roomId));
});
