import { History } from 'history';

export function handleGameHasResetMessage(history: History, roomId: string) {
    history.push(`/controller/${roomId}/lobby`);
}
