import { MessageTypes } from './constants';
import { Socket } from './socket/Socket';

export function handleResetGame(
    socket: Socket,
    dependencies: {
        resetGame: () => void;
        resetPlayer: () => void;
    }
) {
    socket.emit({ type: MessageTypes.backToLobby });
    dependencies.resetGame();
    dependencies.resetPlayer();
}
