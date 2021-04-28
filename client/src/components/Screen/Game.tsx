import * as React from 'react';
import Countdown from 'react-countdown';

import { GameContext } from '../../contexts/GameContextProvider';
import { Container, ContainerTimer, CountdownRenderer, Go } from './Game.sc';
import Goal from './Goal';
import Player from './Player';

const Game: React.FunctionComponent = () => {
    const { countdownTime } = React.useContext(GameContext);
    const [countdown] = React.useState(Date.now() + countdownTime);

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
            <Player />
            <Goal />
        </div>
    );
};
