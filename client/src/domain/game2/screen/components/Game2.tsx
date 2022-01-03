import { Pause, PlayArrow, VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';
import { useParams } from 'react-router';

import { RouteParams } from '../../../../App';
import { MyAudioContext, Sound } from '../../../../contexts/AudioContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../../../contexts/screen/ScreenSocketContextProvider';
import { AudioButton, Container, PauseButton } from '../../../game1/screen/components/Game.sc';
import GameEventEmitter from '../../../phaser/GameEventEmitter';
import { PhaserGame } from '../../../phaser/PhaserGame';

const Game2: React.FunctionComponent = () => {
    const { roomId, hasPaused, screenAdmin } = React.useContext(GameContext);
    const { changeSound, isPlaying, togglePlaying } = React.useContext(MyAudioContext);
    const { id }: RouteParams = useParams();
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);

    if (id && !screenSocket) {
        handleSocketConnection(id, 'game2');
    }

    React.useEffect(() => {
        changeSound(Sound.game2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const container = document.getElementById('phaserWrapper');
        if (container) {
            container.style.display = 'block';
        }

        const game = PhaserGame.getInstance(`phaserGameContainer`);
        game.startGame2Scene(roomId, screenSocket, screenAdmin);

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

    //TODO click on pause immediately - doesn't work because wrong gamestate, countdown still running - fix
    async function handlePause() {
        GameEventEmitter.emitPauseResumeEvent();
    }

    return (
        <Container>
            <PauseButton onClick={handlePause} variant="primary">
                {hasPaused ? <PlayArrow /> : <Pause />}
            </PauseButton>
            <AudioButton onClick={handleAudio} variant="primary">
                {isPlaying ? <VolumeUp /> : <VolumeOff />}
            </AudioButton>
        </Container>
    );
};

export default Game2;
