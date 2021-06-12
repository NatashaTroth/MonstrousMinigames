import { History } from 'history';

import { IObstacle } from '../../../contexts/PlayerContextProvider';
import { controllerChooseCharacterRoute } from '../../../utils/routes';
import { handleConnectedUsersMessage } from '../../gameState/controller/handleConnectedUsersMessage';
import { handleGameHasResetMessage } from '../../gameState/controller/handleGameHasResetMessage';
import { handleGameHasStoppedMessage } from '../../gameState/controller/handleGameHasStoppedMessage';
import { handleGameHasTimedOutMessage } from '../../gameState/controller/handleGameHasTimedOutMessage';
import { handleGameStartedMessage } from '../../gameState/controller/handleGameStartedMessage';
import { handleObstacleMessage } from '../../gameState/controller/handleObstacleMessage';
import { handlePlayerDied } from '../../gameState/controller/handlePlayerDied';
import { handlePlayerFinishedMessage } from '../../gameState/controller/handlePlayerFinishedMessage';
import { handleUserInitMessage } from '../../gameState/controller/handleUserInitMessage';
import { ConnectedUsersMessage, connectedUsersTypeGuard } from '../../typeGuards/connectedUsers';
import { ErrorMessage, errorTypeGuard } from '../../typeGuards/error';
import { ObstacleMessage, obstacleTypeGuard } from '../../typeGuards/obstacle';
import { GameHasPausedMessage, pausedTypeGuard } from '../../typeGuards/paused';
import { PlayerDiedMessage, playerDiedTypeGuard } from '../../typeGuards/playerDied';
import { PlayerFinishedMessage, playerFinishedTypeGuard } from '../../typeGuards/playerFinished';
import { GameHasResetMessage, resetTypeGuard } from '../../typeGuards/reset';
import { GameHasResumedMessage, resumedTypeGuard } from '../../typeGuards/resumed';
import { GameHasStartedMessage, startedTypeGuard } from '../../typeGuards/started';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../typeGuards/stopped';
import { TimedOutMessage, timedOutTypeGuard } from '../../typeGuards/timedOut';
import { UserInitMessage, userInitTypeGuard } from '../../typeGuards/userInit';
import { MessageSocket } from '../MessageSocket';
import { Socket } from '../Socket';

export interface HandleSetSocketDependencies {
    setControllerSocket: (socket: Socket) => void;
    setPlayerAdmin: (val: boolean) => void;
    setPlayerNumber: (val: number) => void;
    setPlayerFinished: (val: boolean) => void;
    setObstacle: (roomId: string | undefined, obstacle: undefined | IObstacle) => void;
    setPlayerRank: (val: number) => void;
    setHasPaused: (val: boolean) => void;
    resetGame: () => void;
    resetPlayer: () => void;
    setGameStarted: (val: boolean) => void;
    setName: (val: string) => void;
    setAvailableCharacters: (val: number[]) => void;
    setUserId: (val: string) => void;
    setPlayerDead: (val: boolean) => void;
    history: History;
}

export function handleSetSocket(
    socket: Socket,
    roomId: string,
    playerFinished: boolean,
    dependencies: HandleSetSocketDependencies
) {
    const {
        setControllerSocket,
        setPlayerNumber,
        setPlayerFinished,
        setObstacle,
        setPlayerRank,
        setPlayerAdmin,
        setHasPaused,
        resetGame,
        resetPlayer,
        setGameStarted,
        setName,
        setAvailableCharacters,
        setUserId,
        setPlayerDead,
        history,
    } = dependencies;

    setControllerSocket(socket);

    const userInitSocket = new MessageSocket(userInitTypeGuard, socket);
    const obstacleSocket = new MessageSocket(obstacleTypeGuard, socket);
    const playerFinishedSocket = new MessageSocket(playerFinishedTypeGuard, socket);
    const timedOutSocket = new MessageSocket(timedOutTypeGuard, socket);
    const startedSocket = new MessageSocket(startedTypeGuard, socket);
    const pausedSocket = new MessageSocket(pausedTypeGuard, socket);
    const resumedSocket = new MessageSocket(resumedTypeGuard, socket);
    const stoppedSocket = new MessageSocket(stoppedTypeGuard, socket);
    const resetSocket = new MessageSocket(resetTypeGuard, socket);
    const errorSocket = new MessageSocket(errorTypeGuard, socket);
    const connectedUsersSocket = new MessageSocket(connectedUsersTypeGuard, socket);
    const playerDiedSocket = new MessageSocket(playerDiedTypeGuard, socket);

    userInitSocket.listen((data: UserInitMessage) => {
        handleUserInitMessage({
            data,
            dependencies: {
                setPlayerAdmin,
                setPlayerNumber,
                setName,
                setUserId,
            },
        });
    });

    obstacleSocket.listen((data: ObstacleMessage) => {
        handleObstacleMessage({
            data,
            roomId,
            setObstacle,
        });
    });

    playerFinishedSocket.listen((data: PlayerFinishedMessage) => {
        handlePlayerFinishedMessage({
            data,
            playerFinished,
            dependencies: {
                setPlayerFinished,
                setPlayerRank,
            },
        });
    });

    timedOutSocket.listen((data: TimedOutMessage) => {
        handleGameHasTimedOutMessage({
            data,
            dependencies: {
                setPlayerFinished,
                setPlayerRank,
            },
        });
    });

    startedSocket.listen((data: GameHasStartedMessage) => {
        handleGameStartedMessage({
            roomId,
            dependencies: {
                setGameStarted,
                history,
            },
        });
    });

    // TODO remove when phaser is ready
    pausedSocket.listen((data: GameHasPausedMessage) => {
        setHasPaused(true);
    });

    resumedSocket.listen((data: GameHasResumedMessage) => {
        setHasPaused(false);
    });

    stoppedSocket.listen((data: GameHasStoppedMessage) => {
        handleGameHasStoppedMessage({ socket, roomId, dependencies: { resetGame, resetPlayer, history } });
    });

    resetSocket.listen((data: GameHasResetMessage) => {
        handleGameHasResetMessage(history, roomId);
    });

    errorSocket.listen((data: ErrorMessage) => {
        // TODO handle errors
    });

    connectedUsersSocket.listen((data: ConnectedUsersMessage) => {
        handleConnectedUsersMessage({ data, dependencies: { setAvailableCharacters } });
    });

    playerDiedSocket.listen((data: PlayerDiedMessage) => {
        handlePlayerDied({
            data,
            dependencies: {
                setPlayerDead,
                setPlayerRank,
            },
        });
    });

    if (socket) {
        history.push(controllerChooseCharacterRoute(roomId));
    }
}
