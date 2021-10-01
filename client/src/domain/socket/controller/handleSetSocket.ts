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
import { handleUserInitMessage } from '../../commonGameState/controller/handleUserInitMessage';
import { handleSetControllerSocketGame1 } from '../../game1/controller/socket/Sockets';
import { handleSetControllerSocketGame3 } from '../../game3/controller/socket/Sockets';
import { MessageSocket } from '../../socket/MessageSocket';
import { Socket } from '../../socket/Socket';
import { ConnectedUsersMessage, connectedUsersTypeGuard, User } from '../../typeGuards/connectedUsers';
import { ErrorMessage, errorTypeGuard } from '../../typeGuards/error';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../typeGuards/finished';
import { PlayerFinishedMessage, playerFinishedTypeGuard } from '../../typeGuards/game1/playerFinished';
import { GameHasStartedMessage, startedTypeGuard } from '../../typeGuards/game1/started';
import { GameSetMessage, gameSetTypeGuard } from '../../typeGuards/gameSet';
import { GameHasPausedMessage, pausedTypeGuard } from '../../typeGuards/paused';
import { GameHasResetMessage, resetTypeGuard } from '../../typeGuards/reset';
import { GameHasResumedMessage, resumedTypeGuard } from '../../typeGuards/resumed';
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
        setPlayerRank,
        setHasPaused,
        setGameStarted,
        setName,
        setAvailableCharacters,
        setUserId,
        setReady,
        history,
        setConnectedUsers,
        playerRank,
        setChosenGame,
    } = dependencies;

    setControllerSocket(socket);

    const userInitSocket = new MessageSocket(userInitTypeGuard, socket);
    const playerFinishedSocket = new MessageSocket(playerFinishedTypeGuard, socket);
    const startedSocket = new MessageSocket(startedTypeGuard, socket);
    const pausedSocket = new MessageSocket(pausedTypeGuard, socket);
    const resumedSocket = new MessageSocket(resumedTypeGuard, socket);
    const stoppedSocket = new MessageSocket(stoppedTypeGuard, socket);
    const resetSocket = new MessageSocket(resetTypeGuard, socket);
    const errorSocket = new MessageSocket(errorTypeGuard, socket);
    const connectedUsersSocket = new MessageSocket(connectedUsersTypeGuard, socket);
    const gameFinishedSocket = new MessageSocket(finishedTypeGuard, socket);
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
            game: data.game,
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

    handleSetControllerSocketGame1(socket, roomId, playerFinished, dependencies);
    handleSetControllerSocketGame3(socket);

    gameSetSocket.listen((data: GameSetMessage) => setChosenGame(data.game));

    if (socket) {
        history.push(controllerChooseCharacterRoute(roomId));
    }
}
