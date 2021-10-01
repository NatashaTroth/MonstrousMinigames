import { History } from 'history';

import { Obstacle } from '../../../contexts/PlayerContextProvider';
import { GameNames } from '../../../utils/games';
import { controllerChooseCharacterRoute } from '../../../utils/routes';
import { handleConnectedUsersMessage } from '../../commonGameState/controller/handleConnectedUsersMessage';
import { handleGameHasFinishedMessage } from '../../commonGameState/controller/handleGameHasFinishedMessage';
import { handleGameHasResetMessage } from '../../commonGameState/controller/handleGameHasResetMessage';
import { handleGameHasStoppedMessage } from '../../commonGameState/controller/handleGameHasStoppedMessage';
import { handleGameStartedMessage } from '../../commonGameState/controller/handleGameStartedMessage';
import { handlePlayerFinishedMessage } from '../../commonGameState/controller/handlePlayerFinishedMessage';
import { handleSheepGameStartedMessage } from '../../commonGameState/controller/handleSheepGameStartedMessage';
import { handleUserInitMessage } from '../../commonGameState/controller/handleUserInitMessage';
import { handleApproachingObstacleMessage } from '../../game1/controller/gameState/handleApproachingSolvableObstacleMessage';
import { handleObstacleMessage } from '../../game1/controller/gameState/handleObstacleMessage';
import { handlePlayerDied } from '../../game1/controller/gameState/handlePlayerDied';
import { handlePlayerStunned } from '../../game1/controller/gameState/handlePlayerStunned';
import { handlePlayerUnstunned } from '../../game1/controller/gameState/handlePlayerUnstunned';
import { handleStunnablePlayers } from '../../game1/controller/gameState/handleStunnablePlayers';
import { MessageSocket } from '../../socket/MessageSocket';
import { Socket } from '../../socket/Socket';
import { ConnectedUsersMessage, connectedUsersTypeGuard, User } from '../../typeGuards/connectedUsers';
import { ErrorMessage, errorTypeGuard } from '../../typeGuards/error';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../typeGuards/finished';
import {
    ApproachingSolvableObstacleMessage,
    approachingSolvableObstacleTypeGuard,
} from '../../typeGuards/game1/approachingSolvableObstacleTypeGuard';
import { exceededMaxChaserPushesTypeGuard } from '../../typeGuards/game1/exceededMaxChaserPushes';
import { ObstacleMessage, obstacleTypeGuard } from '../../typeGuards/game1/obstacle';
import { PlayerDiedMessage, playerDiedTypeGuard } from '../../typeGuards/game1/playerDied';
import { PlayerFinishedMessage, playerFinishedTypeGuard } from '../../typeGuards/game1/playerFinished';
import { playerStunnedTypeGuard } from '../../typeGuards/game1/playerStunned';
import { playerUnstunnedTypeGuard } from '../../typeGuards/game1/playerUnstunned';
import { GameHasStartedMessage, startedTypeGuard } from '../../typeGuards/game1/started';
import { StunnablePlayersMessage, stunnablePlayersTypeGuard } from '../../typeGuards/game1/stunnablePlayers';
import { GameSetMessage, gameSetTypeGuard } from '../../typeGuards/gameSet';
import { GameHasPausedMessage, pausedTypeGuard } from '../../typeGuards/paused';
import { GameHasResetMessage, resetTypeGuard } from '../../typeGuards/reset';
import { GameHasResumedMessage, resumedTypeGuard } from '../../typeGuards/resumed';
import { StartSheepGameMessage, startSheepGameTypeGuard } from '../../typeGuards/startSheepGame';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../typeGuards/stopped';
import { UserInitMessage, userInitTypeGuard } from '../../typeGuards/userInit';

export interface HandleSetSocketDependencies {
    setControllerSocket: (socket: Socket) => void;
    setPlayerNumber: (val: number) => void;
    setPlayerFinished: (val: boolean) => void;
    setObstacle: (roomId: string | undefined, obstacle: undefined | Obstacle) => void;
    setPlayerRank: (val: number) => void;
    setHasPaused: (val: boolean) => void;
    setGameStarted: (val: boolean) => void;
    setSheepGameStarted: (val: boolean) => void;
    setName: (val: string) => void;
    setAvailableCharacters: (val: number[]) => void;
    setUserId: (val: string) => void;
    setReady: (val: boolean) => void;
    setPlayerDead: (val: boolean) => void;
    history: History;
    setConnectedUsers: (val: User[]) => void;
    playerRank: undefined | number;
    setEarlySolvableObstacle: (val: Obstacle | undefined) => void;
    setExceededChaserPushes: (val: boolean) => void;
    setStunnablePlayers: (val: string[]) => void;
    setChosenGame: (val: GameNames) => void;
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
        setSheepGameStarted,
        setName,
        setAvailableCharacters,
        setUserId,
        setReady,
        setPlayerDead,
        history,
        setConnectedUsers,
        playerRank,
        setEarlySolvableObstacle,
        setExceededChaserPushes,
        setStunnablePlayers,
        setChosenGame,
    } = dependencies;

    setControllerSocket(socket);

    const userInitSocket = new MessageSocket(userInitTypeGuard, socket);
    const obstacleSocket = new MessageSocket(obstacleTypeGuard, socket);
    const playerFinishedSocket = new MessageSocket(playerFinishedTypeGuard, socket);
    const startedSocket = new MessageSocket(startedTypeGuard, socket);
    const sheepGameStartedSocket = new MessageSocket(startSheepGameTypeGuard, socket);
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
    const approachingSolvableObstacleSocket = new MessageSocket(approachingSolvableObstacleTypeGuard, socket);
    const exceededMaxChaserPushesSocket = new MessageSocket(exceededMaxChaserPushesTypeGuard, socket);
    const stunnablePlayersSocket = new MessageSocket(stunnablePlayersTypeGuard, socket);
    const gameSetSocket = new MessageSocket(gameSetTypeGuard, socket);

    userInitSocket.listen((data: UserInitMessage) => {
        handleUserInitMessage({
            data,
            dependencies: {
                setPlayerNumber,
                setName,
                setUserId,
                setReady,
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

    sheepGameStartedSocket.listen((data: StartSheepGameMessage) => {
        handleSheepGameStartedMessage({
            roomId,
            countdownTime: data.countdownTime,
            dependencies: {
                setSheepGameStarted,
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
        handlePlayerStunned(history, roomId);
    });

    playerUnstunnedSocket.listen(() => {
        handlePlayerUnstunned(history, roomId);
    });

    gameFinishedSocket.listen((data: GameHasFinishedMessage) => {
        handleGameHasFinishedMessage({
            roomId,
            playerRank,
            playerRanks: data.data.playerRanks,
            dependencies: {
                setPlayerRank,
            },
            history,
        });
    });

    approachingSolvableObstacleSocket.listen((data: ApproachingSolvableObstacleMessage) => {
        handleApproachingObstacleMessage({ data, setEarlySolvableObstacle });
    });

    exceededMaxChaserPushesSocket.listen(() => setExceededChaserPushes(true));

    stunnablePlayersSocket.listen((data: StunnablePlayersMessage) =>
        handleStunnablePlayers({
            data,
            dependencies: {
                setStunnablePlayers,
            },
        })
    );

    gameSetSocket.listen((data: GameSetMessage) => setChosenGame(data.game));

    if (socket) {
        history.push(controllerChooseCharacterRoute(roomId));
    }
}
