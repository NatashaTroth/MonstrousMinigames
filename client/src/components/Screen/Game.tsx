import * as React from 'react'
import Goal from './Goal'
import Player from './Player'
import { Container } from './Game.sc'

const Game: React.FunctionComponent = () => {
    return (
        <Container>
            <Player />
            <Goal />
        </Container>
    )
}

export default Game
