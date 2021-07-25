import { controllerStoneRoute } from '../../../utils/routes';
import history from '../../history/history';

export function handlePlayerGetsStone(roomId: string | undefined) {
    history.push(controllerStoneRoute(roomId));
}
