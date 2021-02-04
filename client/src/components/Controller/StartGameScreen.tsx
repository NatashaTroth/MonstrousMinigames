import * as React from 'react'
import { ClickRequestDeviceMotion } from '../../utils/permissions'
import Button from '../common/Button'
import { SocketContext } from '../../contexts/SocketContextProvider'

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
            <Button onClick={() => controllerSocket?.emit('message', { type: 'resetGame' })} text="Reset Game" />
        </>
    )
}

export default StartGameScreen
