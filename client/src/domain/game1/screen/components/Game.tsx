import { Pause, PlayArrow, Stop, VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';
import { useParams } from 'react-router';

import { RouteParams } from '../../../../App';
import { MyAudioContext, Sound } from '../../../../contexts/AudioContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../../../contexts/screen/ScreenSocketContextProvider';
import GameEventEmitter from '../../../phaser/GameEventEmitter';
import { PhaserGame } from '../../../phaser/PhaserGame';
import { AudioButton, Container, PauseButton, StopButton } from './Game.sc';

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

        const container = document.getElementById('phaserWrapper');
        if (container) {
            container.style.display = 'block';
        }

        const game = PhaserGame.getInstance(`phaserGameContainer`);
        game.startGame1Scene(roomId, screenSocket, screenAdmin);

        return () => {
            const container = document.getElementById('phaserWrapper');
            if (container) {
                container.style.display = 'none';
            }
        };
    }, []);

    async function handleAudio() {
        if (isPlaying) {
            GameEventEmitter.emitPauseAudioEvent();
        } else {
            GameEventEmitter.emitPlayAudioEvent();
        }

        togglePlaying();
    }

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
        </Container>
    );
};

export default Game;
