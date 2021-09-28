import { controllerFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';
import { PlayerFinishedMessage } from '../../typeGuards/game1/playerFinished';

interface HandlePlayerFinished {
    data: PlayerFinishedMessage;
    playerFinished: boolean;
    roomId: string;
    dependencies: {
        setPlayerFinished: (val: boolean) => void;
        setPlayerRank: (val: number) => void;
    };
}

export function handlePlayerFinishedMessage(props: HandlePlayerFinished) {
    const { data, dependencies, roomId, playerFinished } = props;
    const { setPlayerFinished, setPlayerRank } = dependencies;

    if (!playerFinished) {
        setPlayerFinished(true);
        setPlayerRank(data.rank);

        const windmillTimeoutId = sessionStorage.getItem('windmillTimeoutId');
        if (windmillTimeoutId) {
            clearTimeout(Number(windmillTimeoutId));
            sessionStorage.removeItem('windmillTimeoutId');
        }

        history.push(controllerFinishedRoute(roomId));
    }
}
