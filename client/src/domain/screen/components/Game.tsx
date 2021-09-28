import { Pause, PlayArrow, VolumeOff, VolumeUp } from '@material-ui/icons';
import Phaser from 'phaser';
import * as React from 'react';
import { useParams } from 'react-router';

import { RouteParams } from '../../../App';
import { AudioContext } from '../../../contexts/AudioContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../audio/handlePermission';
import GameEventEmitter from '../phaser/GameEventEmitter';
import { AudioButton, Container, PauseButton } from './Game.sc';
import MainScene from './MainScene';

const Game: React.FunctionComponent = () => {
    const { roomId, hasPaused, screenAdmin } = React.useContext(GameContext);
    const {
        pauseLobbyMusicNoMute,
        audioPermission,
        setAudioPermissionGranted,
        musicIsPlaying,
        gameAudioPlaying,
        setGameAudioPlaying,
        mute,
        unMute,
    } = React.useContext(AudioContext);
    const { id }: RouteParams = useParams();
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);

    if (id && !screenSocket) {
        handleSocketConnection(id, 'game1');
    }

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });

        if (Number(localStorage.getItem('audioVolume')) > 0) {
            setGameAudioPlaying(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        pauseLobbyMusicNoMute(audioPermission);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioPermission]);

    React.useEffect(() => {
        const game = new Phaser.Game({
            parent: 'game-root',
            type: Phaser.WEBGL,
            width: '100%',
            height: '100%',
            // backgroundColor: '#081919',
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

        // game.world.setBounds(0,0,7500, window.innerHeight)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleAudio() {
        if (gameAudioPlaying) {
            GameEventEmitter.emitPauseAudioEvent();
            setGameAudioPlaying(false);
            mute();
        } else {
            GameEventEmitter.emitPlayAudioEvent();
            setGameAudioPlaying(true);
            unMute();
        }
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
                {musicIsPlaying ? <VolumeUp /> : <VolumeOff />}
            </AudioButton>
            <GameContent />
        </Container>
    );
};

export default Game;

const GameContent: React.FunctionComponent = () => (
    <div>
        <div id="game-root" data-testid="game-container"></div>
    </div>
);
