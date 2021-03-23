import * as React from 'react'
import Countdown from 'react-countdown'

import { Container, CountdownDiv, Go } from './Game.sc'
import Goal from './Goal'
import Player from './Player'

const Game: React.FunctionComponent = () => {
    return (
        <Container>
            <Countdown
                date={Date.now() + 3000}
                renderer={props => {
                    if (props.completed) {
                        return (
                            <div>
                                <Go>Go</Go>
                                <Player />
                                <Goal />
                            </div>
                        )
                    } else {
                        return <CountdownDiv>{props.seconds}</CountdownDiv>
                    }
                }}
            />
        </Container>
    )
}

export default Game
