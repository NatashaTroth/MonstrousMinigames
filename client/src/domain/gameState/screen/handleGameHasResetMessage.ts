import { History } from 'history';

interface HandleGameHasResetMessage {
    roomId: string;
    dependencies: {
        history: History;
    };
}
export function handleGameHasResetMessage(props: HandleGameHasResetMessage) {
    const { roomId, dependencies } = props;
    const { history } = dependencies;
    history.push(`/screen/${roomId}/lobby`);
}
