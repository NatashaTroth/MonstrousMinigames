import { MessageTypes } from '../../../utils/constants';
import { Socket } from '../../socket/Socket';

export function handleResetGame(
    socket: Socket,
    dependencies: {
        resetGame: () => void;
    },
    sendMessage?: boolean
) {
    if (sendMessage) {
        socket.emit({ type: MessageTypes.backToLobby });
    }

    dependencies.resetGame();
}
