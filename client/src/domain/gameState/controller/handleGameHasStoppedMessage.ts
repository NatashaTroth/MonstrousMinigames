import { History } from 'history';

import { controllerLobbyRoute } from '../../../utils/routes';
import { Socket } from '../../socket/Socket';

interface HandleGameHasStoppedMessage {
    socket: Socket;
    roomId: string;
    dependencies: {
        history: History;
    };
}

export function handleGameHasStoppedMessage(props: HandleGameHasStoppedMessage) {
    const { roomId, dependencies } = props;
    const { history } = dependencies;

    history.push(controllerLobbyRoute(roomId));
}
