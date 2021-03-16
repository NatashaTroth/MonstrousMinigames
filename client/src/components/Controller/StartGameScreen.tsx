import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { PlayerContext } from '../../contexts/PlayerContextProvider'
import { SocketContext } from '../../contexts/SocketContextProvider'
import Button from '../common/Button'
import FullScreenContainer from '../common/FullScreenContainer'
import { Instruction, StartGameScreenContainer } from './StartGameScreen.sc'

const StartGameScreen: React.FunctionComponent = () => {
    const { controllerSocket } = React.useContext(SocketContext)
    const { isPlayerAdmin, permission } = React.useContext(PlayerContext)
    const history = useHistory()

    function startGame() {
        controllerSocket?.emit('message', {
            type: 'game1/start',
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        })
        history.push('/controller/game1')
    }

    return (
        <FullScreenContainer>
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
        </FullScreenContainer>
    )
}

export default StartGameScreen
