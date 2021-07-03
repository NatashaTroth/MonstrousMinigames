import { controllerGame1Route } from '../../../utils/routes';
import history from '../../history/history';

export function handlePlayerUnstunned(roomId: string) {
    history.push(controllerGame1Route(roomId));
}
