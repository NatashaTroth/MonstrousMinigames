import { MESSAGETYPES } from './constants';

export function handleResetGame(
    socket: SocketIOClient.Socket | undefined,
    dependencies: {
        resetGame: () => void;
        resetPlayer: () => void;
    }
) {
    socket?.emit('message', { type: MESSAGETYPES.backToLobby });
    dependencies.resetGame();
    dependencies.resetPlayer();
}
