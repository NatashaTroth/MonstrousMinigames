import * as React from 'react'
import { ClickRequestDeviceMotion } from '../../utils/permissions'
import Button from '../common/Button'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { Instruction, StartGameScreenContainer } from './StartGameScreen.sc'
import { PlayerContext } from '../../contexts/PlayerContextProvider'

interface IStartGameScreen {
    setPermissionGranted: (val: boolean) => void
}

const StartGameScreen: React.FunctionComponent<IStartGameScreen> = ({ setPermissionGranted }) => {
    const { controllerSocket } = React.useContext(SocketContext)
    const { isPlayerAdmin } = React.useContext(PlayerContext)

    function startGame() {
        controllerSocket?.emit('message', {
            type: 'game1/start',
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        })
    }

    return (
        <StartGameScreenContainer>
            {isPlayerAdmin ? (
                <>
                    <Button
                        onClick={async () => {
                            const permission = await ClickRequestDeviceMotion()
                            if (permission) {
                                setPermissionGranted(permission)
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
