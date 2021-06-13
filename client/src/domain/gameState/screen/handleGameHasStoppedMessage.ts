import { History } from 'history';

import { screenLobbyRoute } from '../../../utils/routes';

interface HandleGameHasStoppedMessage {
    roomId: string;
    dependencies: {
        history: History;
    };
}
export function handleGameHasStoppedMessage(props: HandleGameHasStoppedMessage) {
    const { roomId, dependencies } = props;
    const { history } = dependencies;
    history.push(screenLobbyRoute(roomId));
}
