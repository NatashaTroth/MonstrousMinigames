import * as React from 'react'
import { GameContext } from '../../contexts/GameContextProvider'
import { SocketContext } from '../../contexts/SocketContextProvider'
import ConnectScreen from './ConnectScreen'
import FinishedScreen from './FinishedScreen'
import Goal from './Goal'
import Lobby from './Lobby'

import Player from './Player'
import { Container } from './Screen.sc'

const Screen: React.FunctionComponent = () => {
    const { isScreenConnected } = React.useContext(SocketContext)
    const { finished, gameStarted } = React.useContext(GameContext)
    return (
        <>
            {finished ? (
                <FinishedScreen />
            ) : (
                <>
                    {!isScreenConnected && <ConnectScreen />}
                    {isScreenConnected && !gameStarted && <Lobby />}
                    {isScreenConnected && gameStarted && (
                        <Container>
                            <Player />
                            <Goal />
                        </Container>
                    )}
                </>
            )}
        </>
    )
}

export default Screen
