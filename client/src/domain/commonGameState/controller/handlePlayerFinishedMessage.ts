import { controllerFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';
import messageHandler from '../../socket/messageHandler';
import { playerFinishedTypeGuard } from '../../typeGuards/game1/playerFinished';

interface Dependencies {
    setPlayerFinished: (val: boolean) => void;
    setPlayerRank: (val: number) => void;
    playerFinished: boolean;
}

export const playerFinishedHandler = messageHandler(
    playerFinishedTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        const { setPlayerFinished, setPlayerRank, playerFinished } = dependencies;

        if (!playerFinished) {
            setPlayerFinished(true);
            setPlayerRank(message.rank);

            const windmillTimeoutId = sessionStorage.getItem('windmillTimeoutId');
            if (windmillTimeoutId) {
                clearTimeout(Number(windmillTimeoutId));
                sessionStorage.removeItem('windmillTimeoutId');
            }

            history.push(controllerFinishedRoute(roomId));
        }
    }
);
