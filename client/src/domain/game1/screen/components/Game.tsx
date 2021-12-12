import { Pause, PlayArrow, Stop, VolumeOff, VolumeUp } from '@material-ui/icons';
import Phaser from 'phaser';
import * as React from 'react';
import { useParams } from 'react-router';

import { RouteParams } from '../../../../App';
import { MyAudioContext, Sound } from '../../../../contexts/AudioContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../../../contexts/screen/ScreenSocketContextProvider';
import GameEventEmitter from '../../../phaser/GameEventEmitter';
import { AudioButton, Container, PauseButton, StopButton } from './Game.sc';
import MainScene from './MainScene';

const Game: React.FunctionComponent = () => {
    const { roomId, hasPaused, screenAdmin } = React.useContext(GameContext);
    const { isPlaying, changeSound, togglePlaying } = React.useContext(MyAudioContext);
    const { id }: RouteParams = useParams();
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);

    if (id && !screenSocket) {
        handleSocketConnection(id, 'game1');
    }

    React.useEffect(() => {
        changeSound(Sound.game1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const game = new Phaser.Game({
            parent: 'game-root',
            type: Phaser.WEBGL,
            width: '100%',
            height: '100%',
            backgroundColor: '#000b18',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
        });
        game.scene.add('MainScene', MainScene, false); //socket: ScreenSocket.getInstance(socket)
        game.scene.start('MainScene', { roomId, socket: screenSocket, screenAdmin });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            <div>
                <div id="game-root" data-testid="game-container"></div>
            </div>
        </Container>
    );
};

export default Game;
