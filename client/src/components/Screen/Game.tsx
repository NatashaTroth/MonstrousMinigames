import * as React from 'react'

import { Container } from './Game.sc'
import Goal from './Goal'
import Player from './Player'

const Game: React.FunctionComponent = () => {
    return (
        <Container>
            <Player />
            <Goal />
        </Container>
    )
}

export default Game
