import { History } from 'history';

interface HandleGameHasStoppedMessage {
    roomId: string;
    dependencies: {
        history: History;
    };
}
export function handleGameHasStoppedMessage(props: HandleGameHasStoppedMessage) {
    const { roomId, dependencies } = props;
    const { history } = dependencies;
    history.push(`/screen/${roomId}/lobby`);
}
