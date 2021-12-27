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
        // const game = new Phaser.Game({
        //     parent: 'sheep-game',
        //     type: Phaser.WEBGL,
        //     width: '100%',
        //     height: '100%',
        //     // backgroundColor: '#081919',
        //     // backgroundColor: '#000b18',
        //     backgroundColor: '#b9ebff',
        //     physics: {
        //         default: 'arcade',
        //         arcade: {
        //             debug: false,
        //         },
        //     },
        // });
        // game.scene.add('SheepGameScene', SheepGameScene, false); //socket: ScreenSocket.getInstance(socket)
        // game.scene.start('SheepGameScene', { roomId, socket: screenSocket, screenAdmin });

        // game.world.setBounds(0,0,7500, window.innerHeight)
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

    return (
        <Container>
            <PauseButton onClick={handlePause} variant="primary">
                {hasPaused ? <PlayArrow /> : <Pause />}
            </PauseButton>
            <AudioButton onClick={handleAudio} variant="primary">
                {isPlaying ? <VolumeUp /> : <VolumeOff />}
            </AudioButton>
            <GameContent />
        </Container>
    );
};

export default Game2;

const GameContent: React.FunctionComponent = () => (
    <div>
        <div id="sheep-game" data-testid="sheep-game"></div>
    </div>
);
