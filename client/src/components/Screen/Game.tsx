import Phaser from 'phaser'
import * as React from 'react'
import Countdown from 'react-countdown'

import { GameContext } from '../../contexts/GameContextProvider'
import { Container, ContainerTimer, CountdownRenderer, Go } from './Game.sc'
import MainScene from './MainScene'
import Player from './Player'

const Game: React.FunctionComponent = () => {
    const { countdownTime } = React.useContext(GameContext)
    const [countdown] = React.useState(Date.now() + countdownTime)

    React.useEffect(() => {
        new Phaser.Game({
            parent: 'game-root',
            type: Phaser.AUTO,
            width: '100%',
            height: '100%',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
            scene: [MainScene],
        })
    }, [])

    return (
        <Container>
            <Countdown
                date={countdown}
                // autoStart={false}
                renderer={props =>
                    props.completed ? (
                        <GameContent displayGo />
                    ) : (
                        <ContainerTimer>
                            <CountdownRenderer>{props.seconds}</CountdownRenderer>
                        </ContainerTimer>
                    )
                }
            />
        </Container>
    )
}

export default Game

interface IGameContentProps {
    displayGo?: boolean
}

const GameContent: React.FunctionComponent<IGameContentProps> = ({ displayGo }) => {
    return (
        <div>
            {displayGo && <Go>Go!</Go>}
            <Player />
            <div id="game-root"></div>
        </div>
    )
}
