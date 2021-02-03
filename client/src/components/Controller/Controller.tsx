/* eslint-disable no-console */
import * as React from 'react'
import { Socket } from 'socket.io-client'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { ControllerContainer } from './Controller.sc'
import ShakeInstruction from './ShakeInstruction'
import ConnectScreen from './ConnectScreen'
import StartGameScreen from './StartGameScreen'

import ClickObstacle from './ClickObstacle'
import { ObstacleContext } from '../../contexts/ObstacleContextProvider'

const Controller: React.FunctionComponent = () => {
    const [permissionGranted, setPermissionGranted] = React.useState(false)
    const { isControllerConnected } = React.useContext(SocketContext)

    const { controllerSocket } = React.useContext(SocketContext)
    const { obstacle, setObstacle } = React.useContext(ObstacleContext)

    if (permissionGranted) {
        window.addEventListener(
            'devicemotion',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (event: any) => {
                event.preventDefault()
                if (event?.acceleration?.x && (event.acceleration.x < -2 || event.acceleration.x > 2)) {
                    sendMessage(controllerSocket)
                    // console.log('RUN - DeviceMotion: ' + event.acceleration.x + ' m/s2')
                } else {
                    // console.log('STOP')
                }
            }
        )
    }

    return (
        <ControllerContainer>
            {!isControllerConnected && <ConnectScreen />}
            {!permissionGranted && isControllerConnected && (
                <StartGameScreen setPermissionGranted={setPermissionGranted} />
            )}
            {permissionGranted && <ShakeInstruction />}
            {obstacle && <ClickObstacle setObstacle={setObstacle} />}
        </ControllerContainer>
    )
}

export default Controller

function sendMessage(socket: Socket | undefined) {
    socket?.emit('message', {
        type: 'game1/runForward',
        roomId: sessionStorage.getItem('roomId'),
        userId: sessionStorage.getItem('userId'),
    })
    console.log('move')
}
