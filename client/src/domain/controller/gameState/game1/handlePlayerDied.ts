import { controllerPlayerDeadRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import { PlayerDiedMessage } from '../../../typeGuards/playerDied';

interface HandlePlayerDied {
    data: PlayerDiedMessage;
    roomId: string;
    dependencies: { setPlayerDead: (val: boolean) => void; setPlayerRank: (val: number) => void };
}

export const handlePlayerDied = ({ data, roomId, dependencies }: HandlePlayerDied) => {
    const { setPlayerDead, setPlayerRank } = dependencies;

    setPlayerDead(true);
    setPlayerRank(data.rank);
    history.push(controllerPlayerDeadRoute(roomId));
};
