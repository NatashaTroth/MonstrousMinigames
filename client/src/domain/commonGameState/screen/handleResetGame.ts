import { MessageTypes } from '../../../utils/constants';
import { Socket } from '../../socket/Socket';

export function handleResetGame(socket: Socket | undefined) {
    socket?.emit({ type: MessageTypes.backToLobby });
}
