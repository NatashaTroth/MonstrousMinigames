/* eslint-disable no-console */
import * as React from 'react'
import { Socket } from 'socket.io-client'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { ClickRequestDeviceMotion } from '../../utils/permissions'

const Controller: React.FunctionComponent = () => {
    const [permissionGranted, setPermissionGranted] = React.useState(false)
    const [obstacle, setObstacle] = React.useState(false)

    const { socket } = React.useContext(SocketContext)

    const player = document.getElementById('player')

    if (permissionGranted) {
        window.addEventListener(
            'devicemotion',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (event: any) => {
                if (
                    event?.acceleration?.x &&
                    (event.acceleration.x < -2 || event.acceleration.x > 2) &&
                    player &&
                    !obstacle
                ) {
                    sendMessage(socket)
                    // console.log('RUN - DeviceMotion: ' + event.acceleration.x + ' m/s2')
                } else {
                    // console.log('STOP')
                }
            }
        )
    }

    return (
        <>
            {!permissionGranted && (
                <button onClick={async () => setPermissionGranted(await ClickRequestDeviceMotion())}>Start Game</button>
            )}
            <button
                onClick={() => {
                    sendMessage(socket)
                }}
            >
                Move
            </button>
            {/* {obstacle && <ClickObstacle setObstacle={setObstacle} setObstacleRemoved={setObstacleRemoved} />} */}
        </>
    )
}

export default Controller

function sendMessage(socket: Socket | undefined) {
    socket?.emit('message', { type: 'game1/runForward', roomId: '', userId: '' })
}
