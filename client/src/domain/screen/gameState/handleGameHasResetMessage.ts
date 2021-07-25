import { History } from 'history';

import { screenLobbyRoute } from '../../../utils/routes';

interface HandleGameHasResetMessage {
    roomId: string;
    dependencies: {
        history: History;
    };
}
export function handleGameHasResetMessage(props: HandleGameHasResetMessage) {
    const { roomId, dependencies } = props;
    const { history } = dependencies;
    history.push(screenLobbyRoute(roomId));
}
