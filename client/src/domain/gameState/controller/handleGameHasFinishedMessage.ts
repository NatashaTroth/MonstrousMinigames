import { controllerFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';

export const handleGameHasFinishedMessage = (roomId: string) => {
    const stoneTimeoutId = sessionStorage.getItem('stoneTimeoutId');
    if (stoneTimeoutId) {
        // eslint-disable-next-line no-console
        console.log('clear timeout');
        clearTimeout(Number(stoneTimeoutId));
        sessionStorage.removeItem(stoneTimeoutId);
    }

    history.push(controllerFinishedRoute(roomId));
};
