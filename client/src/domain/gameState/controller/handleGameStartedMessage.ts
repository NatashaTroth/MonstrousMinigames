import { History } from 'history';

import { controllerGame1Route } from '../../../utils/routes';

interface HandleGameStarted {
    roomId: string;
    countdownTime: number;
    dependencies: { setGameStarted: (val: boolean) => void; history: History };
}
export function handleGameStartedMessage(props: HandleGameStarted) {
    const { roomId, dependencies, countdownTime } = props;
    const { setGameStarted, history } = dependencies;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.userSelect = 'none';
    setGameStarted(true);
    sessionStorage.setItem('countdownTime', String(countdownTime));

    history.push(controllerGame1Route(roomId));
}
