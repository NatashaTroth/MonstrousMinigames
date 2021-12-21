/* eslint-disable no-console */
import { Pause, PlayArrow, Stop, VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';
import { useParams } from 'react-router';

import { RouteParams } from '../../../../App';
import { MyAudioContext, Sound } from '../../../../contexts/AudioContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../../../contexts/screen/ScreenSocketContextProvider';
import { Game1 } from '../../../phaser/game1/Game1';
import GameEventEmitter from '../../../phaser/GameEventEmitter';
import { AudioButton, Container, PauseButton, StopButton } from './Game.sc';

const Game: React.FunctionComponent = () => {
    const { roomId, hasPaused, screenAdmin, playCount } = React.useContext(GameContext);
    const { isPlaying, changeSound, togglePlaying } = React.useContext(MyAudioContext);
    const { id }: RouteParams = useParams();
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);
    const gameContainer = `${roomId}${playCount}`;

    if (id && !screenSocket) {
        handleSocketConnection(id, 'game1');
    }

    React.useEffect(() => {
        changeSound(Sound.game1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        // console.log('HERE');
        // const gameContainer = document.getElementById('game-container');
        // const rootElement = document.getElementById('root');
        // if (rootElement) {
        //     console.log('Deleting root element');
        //     rootElement.remove();
        //     const newRootElement = document.createElement('div');
        //     newRootElement.setAttribute('id', 'root');
        //     gameContainer?.appendChild(newRootElement);
        // }

        // const game = new Game1(gameContainer);
        // const game = Game1.getInstance('root');
        const game = Game1.getInstance(gameContainer);
        // game.game!.scene.start('MainScene', { roomId, socket: screenSocket, screenAdmin });
        game.startScene(roomId, screenSocket, screenAdmin);
        // eslint-disable-next-line react-hooks/exhaustive-deps

        // return () => {
        //     game.removeScene();
        // };
    }, [playCount]);

    async function handleAudio() {
        if (isPlaying) {
            GameEventEmitter.emitPauseAudioEvent();
        } else {
            GameEventEmitter.emitPlayAudioEvent();
        }

        togglePlaying();
    }

    //TODO click on pause immediately - doesn't work because wrong gamestate, countdown still running - fix
    async function handlePause() {
        GameEventEmitter.emitPauseResumeEvent();
    }

    async function handleStop() {
        GameEventEmitter.emitStopEvent();
    }

    return (
        <Container>
            <PauseButton onClick={handlePause} variant="primary">
                {hasPaused ? <PlayArrow /> : <Pause />}
            </PauseButton>
            <StopButton onClick={handleStop} variant="primary">
                {<Stop />}
            </StopButton>
            <AudioButton onClick={handleAudio} variant="primary">
                {isPlaying ? <VolumeUp /> : <VolumeOff />}
            </AudioButton>
            <div id="game-container">
                <div id={gameContainer} />
                {/* <div id="root" /> */}
            </div>
        </Container>
    );
};

export default Game;
