import Phaser from 'phaser';
import * as React from 'react';
import Countdown from 'react-countdown';
import { useParams } from 'react-router-dom';

import { IRouteParams } from '../../App';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handlePermission } from '../../domain/audio/handlePermission';
import GameEventEmitter from '../../domain/phaser/GameEventEmitter';
import print from '../../domain/phaser/printMethod';
import AudioButton from '../common/AudioButton';
import { Container, Go } from './Game.sc';
import MainScene from './MainScene';

const Game: React.FunctionComponent = () => {
    // const { playLobbyMusic, pauseLobbyMusic, permission, playing, setPermissionGranted, volume } = React.useContext(
    //     AudioContext
    // );
    //const { countdownTime, roomId } = React.useContext(GameContext)
    const { roomId } = React.useContext(GameContext);
    const {
        pauseLobbyMusicNoMute,
        permission,
        setPermissionGranted,
        pauseLobbyMusic,
        playing,
        playLobbyMusic,
        volume,
    } = React.useContext(AudioContext);
    const { id }: IRouteParams = useParams();
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);
    //const [countdown] = React.useState(Date.now() + countdownTime)

    if (id && !screenSocket) {
        handleSocketConnection(id, 'game1');
    }

    const handleAudioPermission = () => {
        if (handlePermission(permission)) {
            print('permission granted');
            setPermissionGranted(true);
        }
    };

    React.useEffect(() => {
        handleAudioPermission();
    }, []);

    // React.useEffect(() => {
    //     if (handlePermission(permission)) {
    //         setPermissionGranted(true);
    //     }
    // }, []);

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
        // handleAudioPermission();
        print(playing);
        if (playing) {
            // game.scene.keys.MainScene.
            print('sending pause event');
            // pauseLobbyMusic(permission);
            GameEventEmitter.emitPauseAudioEvent();
        } else {
            print('sending play event');
            // playLobbyMusic(permission);
            GameEventEmitter.emitPlayAudioEvent();
        }
    }

    return (
        <Container>
            <AudioButton
                type="button"
                name="new"
                onClick={handleAudio}
                playing={playing}
                permission={permission}
                volume={volume}
            ></AudioButton>
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
    return (
        <div>
            {displayGo && <Go>Go!</Go>}
            <div id="game-root"></div>
        </div>
    );
};
