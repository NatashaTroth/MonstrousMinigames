/* eslint-disable no-console */
import * as React from 'react'
import { Socket } from 'socket.io-client'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { ControllerContainer } from './Controller.sc'
import ShakeInstruction from './ShakeInstruction'
import ConnectScreen from './ConnectScreen'
import StartGameScreen from './StartGameScreen'

import ClickObstacle from './ClickObstacle'
import { PlayerContext } from '../../contexts/PlayerContextProvider'
import FinishedScreen from './FinishedScreen'
import { GameContext } from '../../contexts/GameContextProvider'

const Controller: React.FunctionComponent = () => {
    const { isControllerConnected } = React.useContext(SocketContext)
    const { controllerSocket } = React.useContext(SocketContext)
    const { obstacle, setObstacle, playerFinished, permission } = React.useContext(PlayerContext)
    const { gameStarted } = React.useContext(GameContext)

    if (permission) {
        window.addEventListener(
            'devicemotion',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (event: any) => {
                event.preventDefault()
                if (
                    event?.acceleration?.x &&
                    (event.acceleration.x < -2 || event.acceleration.x > 2) &&
                    !playerFinished
                ) {
                    sendMessage(controllerSocket)
                }
            }
        )
    }

    return (
        <ControllerContainer disabled={isControllerConnected}>
            {playerFinished ? (
                <FinishedScreen />
            ) : (
                <>
                    {!isControllerConnected && <ConnectScreen />}
                    {!gameStarted && permission && isControllerConnected && <StartGameScreen />}
                    {gameStarted && permission && !obstacle && <ShakeInstruction />}
                    {obstacle && <ClickObstacle setObstacle={setObstacle} />}
                </>
            )}
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
