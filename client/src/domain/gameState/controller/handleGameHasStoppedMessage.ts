import { History } from 'history';

import { Socket } from '../../socket/Socket';
import { handleResetGame } from './handleResetGame';

interface HandleGameHasStoppedMessage {
    socket: Socket;
    roomId: string;
    dependencies: {
        resetPlayer: () => void;
        resetGame: () => void;
        history: History;
    };
}

export function handleGameHasStoppedMessage(props: HandleGameHasStoppedMessage) {
    const { socket, roomId, dependencies } = props;
    const { resetPlayer, resetGame, history } = dependencies;

    handleResetGame(socket, { resetPlayer, resetGame });
    history.push(`/controller/${roomId}/lobby`);
}
