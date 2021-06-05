import { VolumeOff, VolumeUp } from '@material-ui/icons';
import Phaser from 'phaser';
import * as React from 'react';
import Countdown from 'react-countdown';
import { useParams } from 'react-router-dom';

import { IRouteParams } from '../../App';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import GameEventEmitter from '../../domain/phaser/GameEventEmitter';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import { Container, Go } from './Game.sc';
import MainScene from './MainScene';

const Game: React.FunctionComponent = () => {
    const { roomId, hasPaused } = React.useContext(GameContext);
    const {
        pauseLobbyMusicNoMute,
        permission,
        setPermissionGranted,
        musicIsPlaying,
        gameAudioPlaying,
        setGameAudioPlaying,
        mute,
        unMute,
    } = React.useContext(AudioContext);
    const { id }: IRouteParams = useParams();
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);

    if (id && !screenSocket) {
        handleSocketConnection(id, 'game1');
    }

    React.useEffect(() => {
        handleAudioPermission(permission, { setPermissionGranted });

        if (Number(localStorage.getItem('audioVolume')) > 0) {
            setGameAudioPlaying(true);
        }
    }, []);

    React.useEffect(() => {
        pauseLobbyMusicNoMute(permission);
    }, [permission]);

    let game: Phaser.Game;

    React.useEffect(() => {
        game = new Phaser.Game({
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
    }, []); //roomId -> but being called twice

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

    const myStyle: React.CSSProperties = {
        // color: 'white',
        // backgroundColor: 'DodgerBlue',
        // padding: '10px',
        // fontFamily: 'Arial',

        position: 'absolute',
        width: '100%',
        bottom: '0',
        left: '0',
    };

    return (
        <Container>
            <IconButton onClick={handleAudio}>{musicIsPlaying ? <VolumeUp /> : <VolumeOff />}</IconButton>
            <Countdown></Countdown>
            <GameContent displayGo />
            <div style={myStyle}>
                <Button onClick={handlePause}>{hasPaused ? 'Resume' : 'Pause'}</Button>
            </div>
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
