import { History } from 'history';

import { controllerGame2Route } from '../../../utils/routes';

interface HandleSheepGameStarted {
    roomId: string;
    countdownTime: number;
    dependencies: { setSheepGameStarted: (val: boolean) => void; history: History };
}
export function handleGameStartedMessage(props: HandleSheepGameStarted) {
    const { roomId, dependencies, countdownTime } = props;
    const { setSheepGameStarted, history } = dependencies;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.userSelect = 'none';
    setSheepGameStarted(true);
    sessionStorage.setItem('countdownTime', String(countdownTime));

    history.push(controllerGame2Route(roomId));
}
