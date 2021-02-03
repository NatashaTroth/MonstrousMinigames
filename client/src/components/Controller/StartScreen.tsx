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

const StartScreen: React.FunctionComponent<IStartScreen> = ({ setPermissionGranted }) => {
    const [formState, setFormState] = React.useState<undefined | IFormState>({ name: '', roomId: '' })
    const [textFieldDisabled, setTextFieldDisabled] = React.useState<boolean>(false)
    const { setControllerSocket } = React.useContext(SocketContext)

    function handleSubmit() {
        const controllerSocket = io(
            ENDPOINT +
                'controller?' +
                stringify({
                    name: formState?.name,
                    roomId: formState?.roomId,
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
                setTextFieldDisabled(true)
            }
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
                        disabled={textFieldDisabled}
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
                        disabled={textFieldDisabled}
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
