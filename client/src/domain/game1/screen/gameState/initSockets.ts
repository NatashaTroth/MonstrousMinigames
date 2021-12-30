import { designDevelopment } from '../../../../utils/constants';
import history from '../../../history/history';
import { GameData } from '../../../phaser/gameInterfaces/GameData';
import { Socket } from '../../../socket/Socket';
import { handleStartGame } from '../components/MainScene';
import {
    allScreensPhaserGameLoadedHandler, sendCreateNewGame
} from './allScreensPhaserGameLoadedHandler';
import { chasersPushedHandler } from './chasersPushedHandler';
import { gameFinishedHandler } from './gameFinishedHandler';
import { gameStateInfoHandler } from './gameStateInfoHandler';
import { initialGameStateHandler } from './initialGameStateHandler';
import {
    approachingObstacleHandler, obstacleSkippedHandler, obstacleWillBeSolvedHandler
} from './obstacleHandler';
import { pausedHandler } from './pausedHandler';
import { phaserLoadedTimedOutHandler } from './phaserLoadedTimedOut';
import { resumeHandler } from './resumeHandler';
import { startedHandler } from './startedHandler';
import { stoppedHandler } from './stoppedHandler';

interface Player {
    player: {
        id: string;
    };
    renderer: {
        renderWind: () => void;
    };
    handleApproachingObstacle: () => void;
    handleObstacleSkipped: () => void;
    destroyWarningIcon: () => void;
    handleReset: () => void;
    startRunning: () => void;
    stopRunning: () => void;
}
interface MainScene {
    camera?: { setBackgroundColor: (val: string) => void };
    gameRenderer?: { destroyLoadingScreen: () => void };
    initiateGame: (data: GameData) => void;
    updateGameState: (data: GameData) => void;
    createGameCountdown: (data: number) => void;
    players: Player[];
    gameAudio?: { stopMusic: () => void; pause: () => void; resume: () => void };
    scene: {
        stop: () => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get: (name: string) => any;
        pause: () => void;
        resume: () => void;
    };
    paused: boolean;
}
interface InitSocketsProps {
    socket: Socket | undefined;
    screenAdmin: boolean;
    roomId: string | undefined;
    scene: MainScene;
}

export function initSockets({ socket, screenAdmin, roomId, scene }: InitSocketsProps) {
    if (!socket || !roomId) return;

    if (!designDevelopment) {
        const initialGameStateHandlerWithDependencies = initialGameStateHandler({
            screenAdmin: screenAdmin,
            sendStartGame: () => handleStartGame(socket, roomId),
            initiateGame: data => scene.initiateGame(data),
            camera: scene.camera,
            gameRenderer: scene.gameRenderer,
        });

        initialGameStateHandlerWithDependencies(socket);
    }

    const allScreensPhaserGameLoadedHandlerWithDependencies = allScreensPhaserGameLoadedHandler({
        screenAdmin: screenAdmin,
        sendCreateNewGame: () => sendCreateNewGame(socket, roomId),
    });

    const approachingObstacleHandlerWithDependencies = approachingObstacleHandler({
        players: scene.players,
    });

    const obstacleSkippedHandlerWithDependencies = obstacleSkippedHandler({
        players: scene.players,
    });

    const obstacleWillBeSolvedWithDependencies = obstacleWillBeSolvedHandler({
        players: scene.players,
    });

    const phaserLoadedTimedOutHandlerWithDependencies = phaserLoadedTimedOutHandler({
        history,
    });

    const stoppedHandlerWithDependencies = stoppedHandler({
        scene,
    });

    const startedHandlerWithDependencies = startedHandler({
        createGameCountdown: data => scene.createGameCountdown(data),
    });

    const pauseHandlerWithDependencies = pausedHandler({
        scene,
    });

    const resumeHandlerWithDependencies = resumeHandler({ scene });

    const gameStateInfoHandlerWithDependencies = gameStateInfoHandler({
        updateGameState: data => scene.updateGameState(data),
    });

    const gameFinishedHandlerWithDependencies = gameFinishedHandler({
        scene,
        history,
    });

    const chasersPushedHandlerWithDependencies = chasersPushedHandler({
        players: scene.players,
    });

    allScreensPhaserGameLoadedHandlerWithDependencies(socket);
    approachingObstacleHandlerWithDependencies(socket);
    obstacleSkippedHandlerWithDependencies(socket);
    obstacleWillBeSolvedWithDependencies(socket);
    phaserLoadedTimedOutHandlerWithDependencies(socket, roomId);
    stoppedHandlerWithDependencies(socket);
    startedHandlerWithDependencies(socket);
    pauseHandlerWithDependencies(socket);
    resumeHandlerWithDependencies(socket);
    gameStateInfoHandlerWithDependencies(socket);
    gameFinishedHandlerWithDependencies(socket);
    chasersPushedHandlerWithDependencies(socket);
}
