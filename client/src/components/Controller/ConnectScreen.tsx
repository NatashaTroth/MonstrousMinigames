import * as React from 'react'
import Button from '../common/Button'
import { FormContainer, ConnectScreenContainer, StyledInput, StyledLabel, ImpressumLink } from './ConnectScreen.sc'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { io } from 'socket.io-client'
import { ENDPOINT } from '../../utils/config'
import { stringify } from 'query-string'
import { ClickRequestDeviceMotion } from '../../utils/permissions'
import { PlayerContext } from '../../contexts/PlayerContextProvider'

interface IFormState {
    name?: undefined | string
    roomId?: undefined | string
}

const ConnectScreen: React.FunctionComponent = () => {
    const [formState, setFormState] = React.useState<undefined | IFormState>({ name: '', roomId: '' })
    const { setControllerSocket } = React.useContext(SocketContext)
    const { setPermissionGranted } = React.useContext(PlayerContext)

    async function handleSubmit() {
        const permission = await ClickRequestDeviceMotion()
        if (permission) {
            setPermissionGranted(permission)
        }

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
                document.getElementById('connectForm')?.remove()
            }
        })
    }

    return (
        <ConnectScreenContainer>
            <FormContainer
                onSubmit={e => {
                    e.preventDefault()
                    handleSubmit()
                }}
                id="connectForm"
            >
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
                <Button type="submit" text="Connect" disabled={!formState?.name || !formState?.roomId} />
            </FormContainer>
            <ImpressumLink to="/impressum">Impressum</ImpressumLink>
        </ConnectScreenContainer>
    )
}

export default ConnectScreen
