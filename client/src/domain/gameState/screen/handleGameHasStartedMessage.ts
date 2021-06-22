import { History } from 'history';

import { screenGame1Route } from '../../../utils/routes';
import { StartPhaserGameMessage } from '../../typeGuards/startPhaserGame';

interface HandleGameHasStartedMessage {
    data: StartPhaserGameMessage;
    roomId: string;
    dependencies: {
        // setCountdownTime: (val: number) => void;
        setGameStarted: (val: boolean) => void;
        history: History;
    };
}

export function handleStartGameMessage(props: HandleGameHasStartedMessage) {
    const { data, dependencies, roomId } = props;
    const { setGameStarted, history } = dependencies;
    // eslint-disable-next-line no-console
    console.log('handle start PHASER game RECEIVED');
    // setCountdownTime(data.countdownTime);
    setGameStarted(true);
    history.push(screenGame1Route(roomId));
}
