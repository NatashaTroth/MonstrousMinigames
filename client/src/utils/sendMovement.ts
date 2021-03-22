/* eslint-disable no-console */
import { Socket } from 'socket.io-client'

export function sendMovement(socket: Socket | undefined) {
    socket?.emit('message', {
        type: 'game1/runForward',
        roomId: sessionStorage.getItem('roomId'),
        userId: sessionStorage.getItem('userId'),
    })
    console.log('move')
}
