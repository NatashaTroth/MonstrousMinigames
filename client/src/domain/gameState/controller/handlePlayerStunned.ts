import { controllerPlayerStunnedRoute } from '../../../utils/routes';
import history from '../../history/history';

export function handlePlayerStunned(roomId: string) {
    history.push(controllerPlayerStunnedRoute(roomId));
}
