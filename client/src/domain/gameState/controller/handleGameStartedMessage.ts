import { History } from 'history';

import { MessageTypes } from '../../../utils/constants';

export interface GameStartedMessage {
    type: MessageTypes.started;
}

interface HandleGameStarted {
    roomId: string;
    dependencies: { setGameStarted: (val: boolean) => void; history: History };
}
export function handleGameStartedMessage(props: HandleGameStarted) {
    const { roomId, dependencies } = props;
    const { setGameStarted, history } = dependencies;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.userSelect = 'none';
    setGameStarted(true);

    history.push(`/controller/${roomId}/game1`);
}
