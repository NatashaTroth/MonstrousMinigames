import { controllerFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';
import { PlayerFinishedMessage } from '../../typeGuards/playerFinished';

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

        const stoneTimeoutId = sessionStorage.getItem('stoneTimeoutId');
        if (stoneTimeoutId) {
            // eslint-disable-next-line no-console
            console.log('clear timeout');
            clearTimeout(Number(stoneTimeoutId));
            sessionStorage.removeItem(stoneTimeoutId);
        }

        history.push(controllerFinishedRoute(roomId));
    }
}
