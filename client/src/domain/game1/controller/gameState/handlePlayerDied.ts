import { controllerPlayerDeadRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import { PlayerDiedMessage } from '../../../typeGuards/game1/playerDied';

interface Dependencies {
    setPlayerDead: (val: boolean) => void;
    setPlayerRank: (val: number) => void;
}
export interface HandlePlayerDiedProps {
    data: PlayerDiedMessage;
    roomId: string;
}

export const handlePlayerDied = (dependencies: Dependencies) => {
    return (data: HandlePlayerDiedProps) => {
        const { setPlayerDead, setPlayerRank } = dependencies;
        const {
            data: { rank },
            roomId,
        } = data;

        setPlayerDead(true);
        setPlayerRank(rank);
        history.push(controllerPlayerDeadRoute(roomId));
    };
};
