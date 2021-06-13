import { controllerFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';

export const handleGameHasFinishedMessage = (
    roomId: string,
    stoneTimeout: ReturnType<typeof setTimeout> | undefined
) => {
    if (stoneTimeout) {
        clearTimeout(stoneTimeout);
    }

    history.push(controllerFinishedRoute(roomId));
};
