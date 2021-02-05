import * as React from 'react'
import { SocketContext } from '../../contexts/SocketContextProvider'
import ConnectScreen from './ConnectScreen'

import Player from './Player'
import { Container } from './Screen.sc'

const Screen: React.FunctionComponent = () => {
    const { isScreenConnected } = React.useContext(SocketContext)
    return (
        <>
            {!isScreenConnected && <ConnectScreen />}
            {isScreenConnected && (
                <Container>
                    <Player />
                </Container>
            )}
        </>
    )
}

export default Screen
