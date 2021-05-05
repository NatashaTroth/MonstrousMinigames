import { Socket } from './socket/Socket';

export function sendMovement(socket: Socket, hasPaused: boolean) {
    if (!hasPaused) {
        socket?.emit({
            type: 'game1/runForward',
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        });
    }
}
