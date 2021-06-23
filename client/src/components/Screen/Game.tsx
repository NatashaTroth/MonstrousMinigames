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
import { AudioButton, Container, Go } from './Game.sc';
import MainScene from './MainScene';

const Game: React.FunctionComponent = () => {
    const { roomId } = React.useContext(GameContext);
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
    const { id }: IRouteParams = useParams();
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

    return (
        <Container>
            <AudioButton onClick={handleAudio} variant="primary">
                {musicIsPlaying ? <VolumeUp /> : <VolumeOff />}
            </AudioButton>
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
    const [countdownNrValue, setCountDownValue] = React.useState('3');
    const [counter, setCounter] = React.useState(3);
    const [showCountdown, setShowCountdown] = React.useState(true);

    React.useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (counter === 0) {
            setCountDownValue('Go!');
            setTimeout(() => setShowCountdown(false), 1000);
            // setCounter(counter - 1);
        } else if (counter > 0)
            timer = setInterval(() => {
                setCounter(counter - 1);
                setCountDownValue((counter - 1).toString());
            }, 1000);

        return () => clearInterval(timer);
    }, [counter]);

    return (
        <div>
            {/* {displayGo && <Go>Go!</Go>} */}
            <Go>{showCountdown && countdownNrValue}</Go>{' '}
            {/*TODO: do with phaser, otherwise when come to page after game has started, still get countdown. & need to take number for countdown from backend - 1*/}
            <div id="game-root"></div>
        </div>
    );
};
