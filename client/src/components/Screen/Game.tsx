import Phaser from 'phaser'
import * as React from 'react'
import Countdown from 'react-countdown'

import { GameContext } from '../../contexts/GameContextProvider'
import { Container, Go } from './Game.sc'
import MainScene from './MainScene'

//import Countdown from 'react-countdown'






const Game: React.FunctionComponent = () => {
    //const { countdownTime, roomId } = React.useContext(GameContext)
    const { roomId } = React.useContext(GameContext)
    //const [countdown] = React.useState(Date.now() + countdownTime)
    React.useEffect(() => {
        const game = new Phaser.Game({
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
        })
        game.scene.add('MainScene', MainScene)
        game.scene.start('MainScene', { roomId: roomId})
    }, [roomId])

    return (
        <Container>
            <Countdown></Countdown>
            <GameContent displayGo />
        </Container>
    );
};

export default Game;

interface IGameContentProps {
    displayGo?: boolean;
}

const GameContent: React.FunctionComponent<IGameContentProps> = ({ displayGo }) => {
    return (
        <div>
            {displayGo && <Go>Go!</Go>}
            <div id="game-root"></div>
        </div>
    );
};
