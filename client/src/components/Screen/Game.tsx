//import Countdown from 'react-countdown'
import { IconButton } from '@material-ui/core';
import Phaser from 'phaser';
import * as React from 'react';
import Countdown from 'react-countdown';

import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { MessageTypes } from '../../utils/constants';
import Button from '../common/Button';
import { Container, ControlBar, DialogContent, Go, IconContainer, PauseIcon, StopIcon, StyledDialog } from './Game.sc';
import MainScene from './MainScene';

const Game: React.FunctionComponent = () => {
    //const { countdownTime, roomId } = React.useContext(GameContext)
    const { roomId } = React.useContext(GameContext);
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
        });
        game.scene.add('MainScene', MainScene);
        game.scene.start('MainScene', { roomId: roomId });
    }, [roomId]);

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
    const { screenSocket } = React.useContext(ScreenSocketContext);
    const { hasPaused, setHasPaused } = React.useContext(GameContext);

    function handlePauseGame() {
        screenSocket?.emit({ type: MessageTypes.pauseResume });
        setHasPaused(true);
    }

    function handleResumeGame() {
        screenSocket?.emit({ type: MessageTypes.pauseResume });
        setHasPaused(false);
    }

    function handleStopGame() {
        screenSocket?.emit({ type: MessageTypes.stopGame });
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
            <div id="game-root"></div>

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
        </div>
    );
};
