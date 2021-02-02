import * as React from 'react'
import Player from './Player'
import { Container } from './Screen.sc'

const Screen: React.FunctionComponent = () => {
    return (
        <Container>
            <Player />
        </Container>
    )
}

export default Screen
