import * as React from 'react'

import { Container } from './Game.sc'
import Goal from './Goal'
import Screen from "./Screen"

const Game: React.FunctionComponent = () => {
    return (
        <Container>
            <Screen />
            <Goal />
        </Container>
    )
}

export default Game
