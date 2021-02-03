/* eslint-disable no-console */
import * as React from 'react'
import { Socket } from 'socket.io-client'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { ControllerContainer } from './Controller.sc'
import ShakeInstruction from './ShakeInstruction'
import StartScreen from './StartScreen'

const Controller: React.FunctionComponent = () => {
    const [permissionGranted, setPermissionGranted] = React.useState(false)

    const { socket } = React.useContext(SocketContext)

    if (permissionGranted) {
        window.addEventListener(
            'devicemotion',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (event: any) => {
                if (event?.acceleration?.x && (event.acceleration.x < -2 || event.acceleration.x > 2)) {
                    sendMessage(socket)
                    // console.log('RUN - DeviceMotion: ' + event.acceleration.x + ' m/s2')
                } else {
                    // console.log('STOP')
                }
            }
        )
    }

    return (
        <ControllerContainer>
            {!permissionGranted && <StartScreen setPermissionGranted={setPermissionGranted} />}
            {permissionGranted && <ShakeInstruction />}
            {/* {obstacle && <ClickObstacle setObstacle={setObstacle} setObstacleRemoved={setObstacleRemoved} />} */}
        </ControllerContainer>
    )
}

export default Controller

function sendMessage(socket: Socket | undefined) {
    socket?.emit('message', { type: 'game1/runForward', roomId: '', userId: '' })
}
