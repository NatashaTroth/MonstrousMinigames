/* eslint-disable no-console */
import { GameInstance, IonPhaser } from '@ion-phaser/react';
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
import MainScene from './MainScene';

// const game = Game1.getInstance();

const Game: React.FunctionComponent = () => {
    // const game = {
    //     width: '100%',
    //     height: '100%',
    //     type: Phaser.AUTO,
    //     scene: {},
    // };
    const gameConfig: GameInstance = {
        type: Phaser.AUTO,
        width: '100%',
        height: '100%',
        backgroundColor: '#000b18',
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
            },
        },
        // scene: new MainScene
        // scene: MainScene,
        // scene: new MainScene(),
        // scene: {},
    };
    const { roomId, hasPaused, screenAdmin, playCount } = React.useContext(GameContext);
    const { isPlaying, changeSound, togglePlaying } = React.useContext(MyAudioContext);
    const { id }: RouteParams = useParams();
    const gameContainer = `${roomId}${playCount}`;
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);
    const gameRef = React.useRef<HTMLIonPhaserElement>(null);
    const [game, setGame] = React.useState<GameInstance>();
    const [initialize, setInitialize] = React.useState(false);

    const destroy = () => {
        gameRef.current?.destroy();
        setInitialize(false);
        setGame(undefined);
    };

    if (id && !screenSocket) {
        handleSocketConnection(id, 'game1');
    }

    React.useEffect(() => {
        changeSound(Sound.game1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setInitialize(true);
        return () => {
            destroy();
        };
        // game.startScene(roomId, screenSocket, screenAdmin);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (initialize) {
            console.log(Object.getOwnPropertyNames(gameConfig));
            gameConfig?.instance?.scene.add('MainScene', new MainScene(), false);
            console.log(gameConfig?.instance);
            gameConfig?.instance?.scene
                .getAt(0)
                ?.scene.start('MainScene', { roomId, socket: screenSocket, screenAdmin });
            console.log(gameConfig);

            // gameConfig?.instance?.scene.getAt(0)?.scene.start({ roomId, socket: screenSocket, screenAdmin })
            // gameConfig?.instance?.scene.start('MainScene', { roomId, socket: screenSocket, screenAdmin });
            // .scene.start('MainScene', { roomId, socket: screenSocket, screenAdmin });
            setGame(gameConfig);
        }
    }, [initialize]);

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
        <>
            <IonPhaser ref={gameRef} game={game} initialize={initialize} />
            {/* <button onClick={() => setInitialize(true)}>Initialize</button> */}
            {/* <button onClick={destroy}>Destroy</button> */}
        </>
        // <Container>
        //     <PauseButton onClick={handlePause} variant="primary">
        //         {hasPaused ? <PlayArrow /> : <Pause />}
        //     </PauseButton>
        //     <StopButton onClick={handleStop} variant="primary">
        //         {<Stop />}
        //     </StopButton>
        //     <AudioButton onClick={handleAudio} variant="primary">
        //         {isPlaying ? <VolumeUp /> : <VolumeOff />}
        //     </AudioButton>
        //     <div>
        //         <div id={gameContainer} />
        //     </div>
        // </Container>
    );
};

export default Game;
