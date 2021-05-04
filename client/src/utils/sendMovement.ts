export function sendMovement(socket: SocketIOClient.Socket | undefined, hasPaused: boolean) {
    if (!hasPaused) {
        socket?.emit('message', {
            type: 'game1/runForward',
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        });
    }
}
