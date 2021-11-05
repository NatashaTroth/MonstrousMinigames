import { MessageTypesGame1 } from '../../../../utils/constants';
import { Socket } from '../../../socket/Socket';

export function sendMovement(socket: Socket, hasPaused: boolean) {
    if (!hasPaused) {
        socket.emit({
            type: MessageTypesGame1.runForward,
        });
    }
}
