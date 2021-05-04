import { IconButton } from '@material-ui/core';
import * as React from 'react';
import Countdown from 'react-countdown';

import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { MessageTypes } from '../../utils/constants';
import Button from '../common/Button';
import {
    Container,
    ContainerTimer,
    ControlBar,
    CountdownRenderer,
    DialogContent,
    Go,
    IconContainer,
    PauseIcon,
    StopIcon,
    StyledDialog,
} from './Game.sc';
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
    const { screenSocket } = React.useContext(ScreenSocketContext);
    const { hasPaused, setHasPaused } = React.useContext(GameContext);

    function handlePauseGame() {
        screenSocket?.emit('message', { type: MessageTypes.pauseResume });
        setHasPaused(true);
    }

    function handleResumeGame() {
        screenSocket?.emit('message', { type: MessageTypes.pauseResume });
        setHasPaused(false);
    }

    function handleStopGame() {
        screenSocket?.emit('message', { type: MessageTypes.stopGame });
    }

    return (
        <div>
            <StyledDialog open={hasPaused}>
                <DialogContent>
                    <h3>Game has paused</h3>
                    <Button text="Resume" onClick={handleResumeGame} />
                </DialogContent>
            </StyledDialog>
            {displayGo && <Go>Go!</Go>}
            <Player />
            <ControlBar>
                <IconContainer>
                    <IconButton onClick={handlePauseGame}>
                        <PauseIcon />
                    </IconButton>
                    <IconButton onClick={handleStopGame}>
                        <StopIcon />
                    </IconButton>
                </IconContainer>
            </ControlBar>

            <Goal />
        </div>
    );
};
