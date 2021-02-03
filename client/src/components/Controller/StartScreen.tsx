import * as React from 'react'
import { ClickRequestDeviceMotion } from '../../utils/permissions'
import Button from '../common/Button'
import { FormContainer, StartScreenContainer, StyledInput, StyledLabel } from './StartScreen.sc'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { io } from 'socket.io-client'
import { ENDPOINT } from '../../utils/config'
import { stringify } from 'query-string'

interface IStartScreen {
    setPermissionGranted: (val: boolean) => void
}

interface IFormState {
    name?: undefined | string
    roomId?: undefined | string
}

interface IUserInitMessage {
    name: string
    type: string
    userId: string
    roomId: string
}
const StartScreen: React.FunctionComponent<IStartScreen> = ({ setPermissionGranted }) => {
    const [formState, setFormState] = React.useState<undefined | IFormState>({ name: '', roomId: '' })
    const { setControllerSocket } = React.useContext(SocketContext)

    function handleSubmit() {
        const name = sessionStorage.getItem('name')
        const roomId = sessionStorage.getItem('roomId')
        const userId = sessionStorage.getItem('userId')

        if (!name) {
            sessionStorage.setItem('name', formState?.name || '')
        }

        if (!roomId) {
            sessionStorage.setItem('roomId', formState?.roomId || '')
        }

        const controllerSocket = io(
            ENDPOINT +
                '?' +
                stringify({
                    type: 'controller',
                    name: formState?.name,
                    roomId: formState?.roomId,
                    userId: userId || '',
                }),
            {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
            }
        )

        controllerSocket.on('connect', () => {
            if (controllerSocket) {
                // eslint-disable-next-line no-console
                console.log('Controller Socket connected')
                setControllerSocket(controllerSocket)
            }
        })

        controllerSocket.on('message', (data: IUserInitMessage) => {
            sessionStorage.setItem('userId', data.userId)
        })
    }

    return (
        <StartScreenContainer>
            <FormContainer>
                <StyledLabel>
                    Name
                    <StyledInput
                        type="text"
                        name="name"
                        value={formState?.name}
                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Insert your name"
                    />
                </StyledLabel>
                <StyledLabel>
                    Room Code
                    <StyledInput
                        type="text"
                        name="roomId"
                        value={formState?.roomId}
                        onChange={e => setFormState({ ...formState, roomId: e.target.value })}
                        placeholder="Insert a room code"
                    />
                </StyledLabel>
                <Button
                    onClick={async () => {
                        handleSubmit()
                        setPermissionGranted(await ClickRequestDeviceMotion())
                    }}
                    text="Start Game"
                    disabled={!formState?.name || !formState?.roomId}
                />
            </FormContainer>
        </StartScreenContainer>
    )
}

export default StartScreen
