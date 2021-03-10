import { stringify } from 'query-string'
import * as React from 'react'
import { io } from 'socket.io-client'
import { GameContext } from '../../contexts/GameContextProvider'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { ENDPOINT } from '../../utils/config'
import Button from '../common/Button'
import {
    ConnectScreenContainer,
    ImpressumLink,
    StyledInput,
    StyledLabel,
    FormContainer,
    StyledForm,
} from './ConnectScreen.sc'

interface IFormState {
    roomId: string
}
const ConnectScreen: React.FunctionComponent = () => {
    const [formState, setFormState] = React.useState<undefined | IFormState>({ roomId: '' })
    const { setScreenSocket } = React.useContext(SocketContext)
    const { setRoomId } = React.useContext(GameContext)

    function handleSubmit() {
        const screenSocket = io(
            ENDPOINT +
                'screen?' +
                stringify({
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
        setRoomId(formState?.roomId || undefined)

        screenSocket.on('connect', () => {
            if (screenSocket) {
                // eslint-disable-next-line no-console
                console.log('Screen Socket connected')
                setScreenSocket(screenSocket)
            }
        })
    }

    return (
        <ConnectScreenContainer>
            <FormContainer>
                <Button
                    type="button"
                    name="new"
                    text="Create new Room"
                    disabled={Boolean(formState?.roomId)}
                    onClick={handleSubmit}
                />
                <StyledForm
                    onSubmit={e => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                >
                    <StyledLabel>
                        Join existing Room
                        <StyledInput
                            type="text"
                            name="roomId"
                            value={formState?.roomId}
                            onChange={e => setFormState({ ...formState, roomId: e.target.value })}
                            placeholder="Insert a room code"
                        />
                    </StyledLabel>
                    <Button type="submit" name="join" text="Connect" disabled={!formState?.roomId} />
                </StyledForm>
            </FormContainer>

            <ImpressumLink to="/impressum">Impressum</ImpressumLink>
        </ConnectScreenContainer>
    )
}

export default ConnectScreen
