import { History } from 'history';

import { PlayerRank } from '../../../contexts/ScreenSocketContextProvider';
import { Routes } from '../../../utils/routes';
import { handleConnectedUsersMessage } from '../../commonGameState/screen/handleConnectedUsersMessage';
import { handleGameHasFinishedMessage } from '../../commonGameState/screen/handleGameHasFinishedMessage';
import { handleGameHasResetMessage } from '../../commonGameState/screen/handleGameHasResetMessage';
import { handleGameHasStoppedMessage } from '../../commonGameState/screen/handleGameHasStoppedMessage';
import { handleGameStartedMessage } from '../../commonGameState/screen/handleGameStartedMessage';
import { handleStartPhaserGameMessage } from '../../commonGameState/screen/handleStartPhaserGameMessage';
import { handleSetScreenSocketGame3 } from '../../game3/screen/socket/Sockets';
import { MessageSocket } from '../../socket/MessageSocket';
import ScreenSocket from '../../socket/screenSocket';
import { Socket } from '../../socket/Socket';
import { ConnectedUsersMessage, connectedUsersTypeGuard, User } from '../../typeGuards/connectedUsers';
import { ErrorMessage, errorTypeGuard } from '../../typeGuards/error';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../typeGuards/finished';
import { GameHasStartedMessage, startedTypeGuard } from '../../typeGuards/game1/started';
import { pausedTypeGuard } from '../../typeGuards/paused';
import { resetTypeGuard } from '../../typeGuards/reset';
import { resumedTypeGuard } from '../../typeGuards/resumed';
import { ScreenAdminMessage, screenAdminTypeGuard } from '../../typeGuards/screenAdmin';
import { ScreenStateMessage, screenStateTypeGuard } from '../../typeGuards/screenState';
import { StartPhaserGameMessage, startPhaserGameTypeGuard } from '../../typeGuards/startPhaserGame';
import { stoppedTypeGuard } from '../../typeGuards/stopped';

export interface HandleSetSocketDependencies {
    setScreenSocket: (socket: Socket) => void;
    setConnectedUsers: (users: User[]) => void;
    setHasPaused: (val: boolean) => void;
    setGameStarted: (val: boolean) => void;
    setCountdownTime: (val: number) => void;
    setFinished: (val: boolean) => void;
    setPlayerRanks: (val: PlayerRank[]) => void;
    setScreenAdmin: (val: boolean) => void;
    setScreenState: (val: string) => void;
    history: History;
}

export function handleSetSocket(
    socket: Socket,
    roomId: string,
    dependencies: HandleSetSocketDependencies,
    route?: string
) {
    const {
        setScreenSocket,
        setConnectedUsers,
        setHasPaused,
        setGameStarted,
        setPlayerRanks,
        setFinished,
        setScreenAdmin,
        setScreenState,
        history,
    } = dependencies;

    setScreenSocket(socket);
    ScreenSocket.getInstance(socket);

    const connectedUsersSocket = new MessageSocket(connectedUsersTypeGuard, socket);
    const startPhaserGameSocket = new MessageSocket(startPhaserGameTypeGuard, socket);
    const finishedSocket = new MessageSocket(finishedTypeGuard, socket);
    const resetSocket = new MessageSocket(resetTypeGuard, socket);
    const pausedSocket = new MessageSocket(pausedTypeGuard, socket);
    const resumedSocket = new MessageSocket(resumedTypeGuard, socket);
    const stoppedSocket = new MessageSocket(stoppedTypeGuard, socket);
    const errorSocket = new MessageSocket(errorTypeGuard, socket);
    const screenAdminSocket = new MessageSocket(screenAdminTypeGuard, socket);
    const screenStateSocket = new MessageSocket(screenStateTypeGuard, socket);
    const startedSocket = new MessageSocket(startedTypeGuard, socket);

    connectedUsersSocket.listen((data: ConnectedUsersMessage) =>
        handleConnectedUsersMessage({ data, dependencies: { setConnectedUsers } })
    );

    finishedSocket.listen((data: GameHasFinishedMessage) =>
        handleGameHasFinishedMessage({ data, roomId, dependencies: { setFinished, setPlayerRanks, history } })
    );

    startPhaserGameSocket.listen((data: StartPhaserGameMessage) =>
        handleStartPhaserGameMessage({ roomId, dependencies: { setGameStarted, history } })
    );

    pausedSocket.listen(() => setHasPaused(true));

    resumedSocket.listen(() => setHasPaused(false));

    stoppedSocket.listen(() => handleGameHasStoppedMessage({ roomId, dependencies: { history } }));

    resetSocket.listen(() => handleGameHasResetMessage({ roomId, dependencies: { history } }));

    errorSocket.listen((data: ErrorMessage) => {
        // TODO handle errors
    });

    screenAdminSocket.listen((data: ScreenAdminMessage) => setScreenAdmin(data.isAdmin));

    screenStateSocket.listen((data: ScreenStateMessage) => setScreenState(data.state));

    startedSocket.listen((data: GameHasStartedMessage) => {
        handleGameStartedMessage({
            roomId,
            game: data.game,
            dependencies: {
                setGameStarted,
                history,
            },
        });
    });

    handleSetScreenSocketGame3(socket);

    if (socket) {
        history.push(`${Routes.screen}/${roomId}/${route || Routes.lobby}`);
    }
}
