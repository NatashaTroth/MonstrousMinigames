import { MessageTypes } from '../../../utils/constants';
import { Socket } from '../../socket/Socket';

export function sendMovement(socket: Socket, hasPaused: boolean) {
    if (!hasPaused) {
        socket.emit({
            type: MessageTypes.runForward,
        });
    }
}
