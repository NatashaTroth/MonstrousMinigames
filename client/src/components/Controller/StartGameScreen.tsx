import * as React from 'react'
import Button from '../common/Button'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { Instruction, StartGameScreenContainer } from './StartGameScreen.sc'
import { PlayerContext } from '../../contexts/PlayerContextProvider'

const StartGameScreen: React.FunctionComponent = () => {
    const { controllerSocket, setGameStarted } = React.useContext(SocketContext)
    const { isPlayerAdmin, permission } = React.useContext(PlayerContext)

    function startGame() {
        controllerSocket?.emit('message', {
            type: 'game1/start',
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        })
        setGameStarted(true)
    }

    return (
        <StartGameScreenContainer>
            {isPlayerAdmin ? (
                <>
                    <Button
                        onClick={() => {
                            if (permission) {
                                startGame()
                            }
                        }}
                        text="Start Game"
                    />
                    <Button
                        onClick={() => controllerSocket?.emit('message', { type: 'resetGame' })}
                        text="Reset Game"
                    />
                </>
            ) : (
                <Instruction>Wait until the Admin starts the Game</Instruction>
            )}
        </StartGameScreenContainer>
    )
}

export default StartGameScreen
