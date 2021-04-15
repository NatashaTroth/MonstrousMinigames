export function sendMovement(socket: SocketIOClient.Socket | undefined) {
    socket?.emit('message', {
        type: 'game1/runForward',
        roomId: sessionStorage.getItem('roomId'),
        userId: sessionStorage.getItem('userId'),
    })
}
