import { History } from 'history';

import { PlayerRank } from '../../../contexts/ScreenSocketContextProvider';
import { handleConnectedUsersMessage } from '../../gameState/screen/handleConnectedUsersMessage';
import { handleGameHasFinishedMessage } from '../../gameState/screen/handleGameHasFinishedMessage';
import { handleGameHasResetMessage } from '../../gameState/screen/handleGameHasResetMessage';
import { handleGameHasStartedMessage } from '../../gameState/screen/handleGameHasStartedMessage';
import { handleGameHasStoppedMessage } from '../../gameState/screen/handleGameHasStoppedMessage';
import { handleGameHasTimedOutMessage } from '../../gameState/screen/handleGameHasTimedOutMessage';
import { ConnectedUsersMessage, connectedUsersTypeGuard, IUser } from '../../typeGuards/connectedUsers';
import { ErrorMessage, errorTypeGuard } from '../../typeGuards/error';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../typeGuards/finished';
import { pausedTypeGuard } from '../../typeGuards/paused';
import { resetTypeGuard } from '../../typeGuards/reset';
import { resumedTypeGuard } from '../../typeGuards/resumed';
import { screenAdminTypeGuard } from '../../typeGuards/screenAdmin';
import { GameHasStartedMessage, startedTypeGuard } from '../../typeGuards/started';
import { stoppedTypeGuard } from '../../typeGuards/stopped';
import { TimedOutMessage, timedOutTypeGuard } from '../../typeGuards/timedOut';
import { MessageSocket } from '../MessageSocket';
import ScreenSocket from '../screenSocket';
import { Socket } from '../Socket';

export interface HandleSetSocketDependencies {
    setScreenSocket: (socket: Socket) => void;
    setConnectedUsers: (users: IUser[]) => void;
    setHasPaused: (val: boolean) => void;
    setGameStarted: (val: boolean) => void;
    setCountdownTime: (val: number) => void;
    setHasTimedOut: (val: boolean) => void;
    setFinished: (val: boolean) => void;
    setPlayerRanks: (val: PlayerRank[]) => void;
    setScreenAdmin: (val: boolean) => void;
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
        setCountdownTime,
        setGameStarted,
        setHasTimedOut,
        setPlayerRanks,
        setFinished,
        setScreenAdmin,
        history,
    } = dependencies;

    setScreenSocket(socket);
    ScreenSocket.getInstance(socket);

    const connectedUsersSocket = new MessageSocket(connectedUsersTypeGuard, socket);
    const startedSocket = new MessageSocket(startedTypeGuard, socket);
    const finishedSocket = new MessageSocket(finishedTypeGuard, socket);
    const resetSocket = new MessageSocket(resetTypeGuard, socket);
    const pausedSocket = new MessageSocket(pausedTypeGuard, socket);
    const resumedSocket = new MessageSocket(resumedTypeGuard, socket);
    const stoppedSocket = new MessageSocket(stoppedTypeGuard, socket);
    const errorSocket = new MessageSocket(errorTypeGuard, socket);
    const timedOutSocket = new MessageSocket(timedOutTypeGuard, socket);
    const screenAdminSocket = new MessageSocket(screenAdminTypeGuard, socket);

    connectedUsersSocket.listen((data: ConnectedUsersMessage) =>
        handleConnectedUsersMessage({ data, dependencies: { setConnectedUsers } })
    );

    finishedSocket.listen((data: GameHasFinishedMessage) =>
        handleGameHasFinishedMessage({ data, roomId, dependencies: { setFinished, setPlayerRanks, history } })
    );

    timedOutSocket.listen((data: TimedOutMessage) => {
        handleGameHasTimedOutMessage({ dependencies: { setHasTimedOut } });
        handleGameHasFinishedMessage({ data, roomId, dependencies: { setFinished, setPlayerRanks, history } });
    });

    startedSocket.listen((data: GameHasStartedMessage) =>
        handleGameHasStartedMessage({ data, roomId, dependencies: { setCountdownTime, setGameStarted, history } })
    );

    pausedSocket.listen(() => setHasPaused(true));

    resumedSocket.listen(() => setHasPaused(false));

    stoppedSocket.listen(() => handleGameHasStoppedMessage({ roomId, dependencies: { history } }));

    resetSocket.listen(() => handleGameHasResetMessage({ roomId, dependencies: { history } }));

    errorSocket.listen((data: ErrorMessage) => {
        // TODO handle errors
    });

    screenAdminSocket.listen(() => setScreenAdmin(true));

    if (socket) {
        history.push(`/screen/${roomId}/${route || 'lobby'}`);
    }
}
