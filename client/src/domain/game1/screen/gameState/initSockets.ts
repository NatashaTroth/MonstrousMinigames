import history from '../../../history/history';
import { Socket } from '../../../socket/Socket';
import MainScene, { handleStartGame } from '../components/MainScene';
import { allScreensPhaserGameLoadedHandler, sendCreateNewGame } from './allScreensPhaserGameLoadedHandler';
import { chasersPushedHandler } from './chasersPushedHandler';
import { gameFinishedHandler } from './gameFinishedHandler';
import { gameStateInfoHandler } from './gameStateInfoHandler';
import { initialGameStateHandler } from './initialGameStateHandler';
import { approachingObstacleHandler, obstacleSkippedHandler, obstacleWillBeSolvedHandler } from './obstacleHandler';
import { pausedHandler } from './pausedHandler';
import { phaserLoadedTimedOutHandler } from './phaserLoadedTimedOut';
import { resumeHandler } from './resumeHandler';
import { startedHandler } from './startedHandler';
import { stoppedHandler } from './stoppedHandler';

interface InitSocketsProps {
    socket: Socket | undefined;
    screenAdmin: boolean;
    roomId: string | undefined;
    scene: MainScene;
}

export function initSockets({ socket, screenAdmin, roomId, scene }: InitSocketsProps) {
    if (!socket || !roomId) return;

    const initialGameStateHandlerWithDependencies = initialGameStateHandler({
        screenAdmin: screenAdmin,
        sendStartGame: () => handleStartGame(socket, roomId),
        initiateGame: data => scene.initiateGame(data),
        camera: scene.camera,
        gameRenderer: scene.gameRenderer,
    });

    const allScreensPhaserGameLoadedHandlerWithDependencies = allScreensPhaserGameLoadedHandler({
        screenAdmin: screenAdmin,
        sendCreateNewGame: () => sendCreateNewGame(socket!, roomId),
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

    initialGameStateHandlerWithDependencies(socket);
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
    gameFinishedHandlerWithDependencies(socket, roomId);
    chasersPushedHandlerWithDependencies(socket);
}
