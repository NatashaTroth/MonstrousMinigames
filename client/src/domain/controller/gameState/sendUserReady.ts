import { MessageTypes } from '../../../utils/constants';
import { Socket } from '../../socket/Socket';

export function sendUserReady(socket: Socket) {
    socket.emit({
        type: MessageTypes.userReady,
    });
}
