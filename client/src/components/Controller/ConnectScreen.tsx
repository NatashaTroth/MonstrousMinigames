import * as React from 'react'
import { useParams } from 'react-router'

import { IRouteParams } from '../../App'
import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider'
import { PlayerContext } from '../../contexts/PlayerContextProvider'
import { sendMovement } from '../../utils/sendMovement'
import Button from '../common/Button'
import { ConnectScreenContainer, FormContainer, ImpressumLink, StyledInput, StyledLabel } from './ConnectScreen.sc'

interface IFormState {
    name: string
    roomId: string
}

export const ConnectScreen: React.FunctionComponent = () => {
    const { id }: IRouteParams = useParams()
    const [formState, setFormState] = React.useState<IFormState>({ name: '', roomId: id || '' })
    const { controllerSocket, handleSocketConnection } = React.useContext(ControllerSocketContext)
    const { playerFinished, permission } = React.useContext(PlayerContext)

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

    return (
        <ConnectScreenContainer>
            <FormContainer
                onSubmit={e => {
                    e.preventDefault()
                    handleSocketConnection(formState.roomId, formState?.name)
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
                        required
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
                        required
                    />
                </StyledLabel>
                <Button type="submit" text="Connect" disabled={!formState?.name || !formState?.roomId} />
            </FormContainer>
            <ImpressumLink to="/impressum">Impressum</ImpressumLink>
        </ConnectScreenContainer>
    )
}
