import { History } from 'history';

import { screenGame1Route } from '../../../utils/routes';
import { GameHasStartedMessage } from '../../typeGuards/started';

interface HandleGameHasStartedMessage {
    data: GameHasStartedMessage;
    roomId: string;
    dependencies: {
        setCountdownTime: (val: number) => void;
        setGameStarted: (val: boolean) => void;
        history: History;
    };
}

export function handleGameHasStartedMessage(props: HandleGameHasStartedMessage) {
    const { data, dependencies, roomId } = props;
    const { setCountdownTime, setGameStarted, history } = dependencies;

    setCountdownTime(data.countdownTime);
    setGameStarted(true);
    history.push(screenGame1Route(roomId));
}
