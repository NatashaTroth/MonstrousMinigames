import { MessageTypes } from './constants';

export function handleResetGame(
    socket: SocketIOClient.Socket | undefined,
    dependencies: {
        resetGame: () => void;
        resetPlayer: () => void;
    }
) {
    socket?.emit('message', { type: MessageTypes.backToLobby });
    dependencies.resetGame();
    dependencies.resetPlayer();
}
