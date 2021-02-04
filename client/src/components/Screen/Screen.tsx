import * as React from 'react'
import { io } from 'socket.io-client'
import { SocketContext } from '../../contexts/SocketContextProvider'
import { ENDPOINT } from '../../utils/config'

import Player from './Player'
import { Container } from './Screen.sc'

const Screen: React.FunctionComponent = () => {
    const { setScreenSocket, screenSocket } = React.useContext(SocketContext)

    React.useEffect(() => {
        const socket = io(ENDPOINT + 'screen', {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 10000,
            transports: ['websocket'],
        })

        if (!screenSocket) {
            socket.on('connect', () => {
                if (socket) {
                    // eslint-disable-next-line no-console
                    console.log('Screen Socket connected')
                    setScreenSocket(socket)
                }
            })
        }
    })
    return (
        <Container>
            <Player />
        </Container>
    )
}

export default Screen
