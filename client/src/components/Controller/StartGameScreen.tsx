import * as React from 'react'
import { ClickRequestDeviceMotion } from '../../utils/permissions'
import Button from '../common/Button'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { StartGameScreenContainer } from './StartGameScreen.sc'

interface IStartGameScreen {
    setPermissionGranted: (val: boolean) => void
}

const StartGameScreen: React.FunctionComponent<IStartGameScreen> = ({ setPermissionGranted }) => {
    const { controllerSocket } = React.useContext(SocketContext)

    function startGame() {
        controllerSocket?.emit('message', {
            type: 'game1/start',
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        })
    }

    return (
        <StartGameScreenContainer>
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
            <Button onClick={() => controllerSocket?.emit('message', { type: 'resetGame' })} text="Reset Game" />
        </StartGameScreenContainer>
    )
}

export default StartGameScreen
