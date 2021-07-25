import { History } from 'history';

import { Obstacle } from '../../../contexts/PlayerContextProvider';
import { controllerChooseCharacterRoute } from '../../../utils/routes';
import { MessageSocket } from '../../socket/MessageSocket';
import { Socket } from '../../socket/Socket';
import { ConnectedUsersMessage, connectedUsersTypeGuard, User } from '../../typeGuards/connectedUsers';
import { ErrorMessage, errorTypeGuard } from '../../typeGuards/error';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../typeGuards/finished';
import { ObstacleMessage, obstacleTypeGuard } from '../../typeGuards/obstacle';
import { GameHasPausedMessage, pausedTypeGuard } from '../../typeGuards/paused';
import { PlayerDiedMessage, playerDiedTypeGuard } from '../../typeGuards/playerDied';
import { PlayerFinishedMessage, playerFinishedTypeGuard } from '../../typeGuards/playerFinished';
import { playerStunnedTypeGuard } from '../../typeGuards/playerStunned';
import { playerUnstunnedTypeGuard } from '../../typeGuards/playerUnstunned';
import { GameHasResetMessage, resetTypeGuard } from '../../typeGuards/reset';
import { GameHasResumedMessage, resumedTypeGuard } from '../../typeGuards/resumed';
import { GameHasStartedMessage, startedTypeGuard } from '../../typeGuards/started';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../typeGuards/stopped';
import { UserInitMessage, userInitTypeGuard } from '../../typeGuards/userInit';
import { handleConnectedUsersMessage } from '../gameState/handleConnectedUsersMessage';
import { handleGameHasFinishedMessage } from '../gameState/handleGameHasFinishedMessage';
import { handleGameHasResetMessage } from '../gameState/handleGameHasResetMessage';
import { handleGameHasStoppedMessage } from '../gameState/handleGameHasStoppedMessage';
import { handleGameStartedMessage } from '../gameState/handleGameStartedMessage';
import { handleObstacleMessage } from '../gameState/handleObstacleMessage';
import { handlePlayerDied } from '../gameState/handlePlayerDied';
import { handlePlayerFinishedMessage } from '../gameState/handlePlayerFinishedMessage';
import { handlePlayerStunned } from '../gameState/handlePlayerStunned';
import { handlePlayerUnstunned } from '../gameState/handlePlayerUnstunned';
import { handleUserInitMessage } from '../gameState/handleUserInitMessage';

export interface HandleSetSocketDependencies {
    setControllerSocket: (socket: Socket) => void;
    setPlayerNumber: (val: number) => void;
    setPlayerFinished: (val: boolean) => void;
    setObstacle: (roomId: string | undefined, obstacle: undefined | Obstacle) => void;
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
    setConnectedUsers: (val: User[]) => void;
    playerRank: undefined | number;
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
        setHasPaused,
        setGameStarted,
        setName,
        setAvailableCharacters,
        setUserId,
        setPlayerDead,
        history,
        setConnectedUsers,
        playerRank,
    } = dependencies;

    setControllerSocket(socket);

    const userInitSocket = new MessageSocket(userInitTypeGuard, socket);
    const obstacleSocket = new MessageSocket(obstacleTypeGuard, socket);
    const playerFinishedSocket = new MessageSocket(playerFinishedTypeGuard, socket);
    const startedSocket = new MessageSocket(startedTypeGuard, socket);
    const pausedSocket = new MessageSocket(pausedTypeGuard, socket);
    const resumedSocket = new MessageSocket(resumedTypeGuard, socket);
    const stoppedSocket = new MessageSocket(stoppedTypeGuard, socket);
    const resetSocket = new MessageSocket(resetTypeGuard, socket);
    const errorSocket = new MessageSocket(errorTypeGuard, socket);
    const connectedUsersSocket = new MessageSocket(connectedUsersTypeGuard, socket);
    const playerDiedSocket = new MessageSocket(playerDiedTypeGuard, socket);
    const playerStunnedSocket = new MessageSocket(playerStunnedTypeGuard, socket);
    const gameFinishedSocket = new MessageSocket(finishedTypeGuard, socket);
    const playerUnstunnedSocket = new MessageSocket(playerUnstunnedTypeGuard, socket);

    userInitSocket.listen((data: UserInitMessage) => {
        handleUserInitMessage({
            data,
            dependencies: {
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
            roomId,
            playerFinished,
            dependencies: {
                setPlayerFinished,
                setPlayerRank,
            },
        });
    });

    startedSocket.listen((data: GameHasStartedMessage) => {
        handleGameStartedMessage({
            roomId,
            countdownTime: data.countdownTime,
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
        handleGameHasStoppedMessage({ socket, roomId, dependencies: { history } });
    });

    resetSocket.listen((data: GameHasResetMessage) => {
        handleGameHasResetMessage(history, roomId);
    });

    errorSocket.listen((data: ErrorMessage) => {
        // TODO handle errors
    });

    connectedUsersSocket.listen((data: ConnectedUsersMessage) => {
        handleConnectedUsersMessage({ data, dependencies: { setAvailableCharacters, setConnectedUsers } });
    });

    playerDiedSocket.listen((data: PlayerDiedMessage) => {
        handlePlayerDied({
            data,
            roomId,
            dependencies: {
                setPlayerDead,
                setPlayerRank,
            },
        });
    });

    playerStunnedSocket.listen(() => {
        handlePlayerStunned(roomId);
    });

    playerUnstunnedSocket.listen(() => {
        handlePlayerUnstunned(roomId);
    });

    gameFinishedSocket.listen((data: GameHasFinishedMessage) => {
        handleGameHasFinishedMessage({
            roomId,
            playerRank,
            playerRanks: data.data.playerRanks,
            dependencies: {
                setPlayerRank,
            },
        });
    });

    if (socket) {
        history.push(controllerChooseCharacterRoute(roomId));
    }
}
