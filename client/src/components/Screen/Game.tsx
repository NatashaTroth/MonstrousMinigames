import * as React from 'react'
import Countdown from 'react-countdown'

import { GameContext } from '../../contexts/GameContextProvider'
import { Container, ContainerTimer, CountdownRenderer, Go } from './Game.sc'
import Goal from './Goal'
import Player from './Player'

const Game: React.FunctionComponent = () => {
    const { countdownTime } = React.useContext(GameContext)
    // const countdownRef = React.useRef()
    // const countdownRef = ref
    //   const handleStart = () => countdownRef.current.start();

    return (
        <Container>
            {countdownTime > 0 ? (
                <Countdown
                    date={Date.now() + 3000}
                    // ref={countdownRef}
                    // autoStart={false}
                    renderer={props => {
                        // eslint-disable-next-line no-console
                        console.log(countdownTime)
                        // eslint-disable-next-line no-console
                        console.log(props)

                        if (props.completed) {
                            return (
                                <div>
                                    <Go>Go!</Go>
                                    <Player />
                                    <Goal />
                                </div>
                            )
                        } else {
                            return (
                                <ContainerTimer>
                                    <CountdownRenderer>{props.seconds}</CountdownRenderer>
                                </ContainerTimer>
                            )
                        }
                    }}
                />
            ) : (
                <div>
                    <Player />
                    <Goal />
                </div>
            )}
        </Container>
    )
}

export default Game
