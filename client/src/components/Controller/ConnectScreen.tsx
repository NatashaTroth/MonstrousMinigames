import { stringify } from 'query-string'
import * as React from 'react'
import { io } from 'socket.io-client'

import { PlayerContext } from '../../contexts/PlayerContextProvider'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { ENDPOINT } from '../../utils/config'
import { ClickRequestDeviceMotion } from '../../utils/permissions'
import { sendMovement } from '../../utils/sendMovement'
import Button from '../common/Button'
import { ConnectScreenContainer, FormContainer, ImpressumLink, StyledInput, StyledLabel } from './ConnectScreen.sc'

interface IFormState {
    name?: undefined | string
    roomId?: undefined | string
}

export const ConnectScreen: React.FunctionComponent = () => {
    const [formState, setFormState] = React.useState<undefined | IFormState>({ name: '', roomId: '' })
    const { setControllerSocket } = React.useContext(SocketContext)
    const { setPermissionGranted, playerFinished, permission } = React.useContext(PlayerContext)
    const { controllerSocket } = React.useContext(SocketContext)

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
                    sendMovement(controllerSocket)
                }
            }
        )
    }

    async function handleSubmit() {
        const permission = await ClickRequestDeviceMotion()
        if (permission) {
            setPermissionGranted(permission)
        }

        const controllerSocket = io(
            `${ENDPOINT}controller?${stringify({
                name: formState?.name,
                roomId: formState?.roomId,
                userId: sessionStorage.getItem('userId') || '',
            })}`,
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
    }

    return (
        <ConnectScreenContainer>
            <FormContainer
                onSubmit={e => {
                    e.preventDefault()
                    handleSubmit()
                }}
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
