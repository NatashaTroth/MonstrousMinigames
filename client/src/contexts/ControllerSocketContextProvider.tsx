import * as React from 'react';

import history from '../domain/history/history';
import { handleSetSocket } from '../domain/socket/controller/handleSetSocket';
import { handleSocketConnection } from '../domain/socket/controller/handleSocketConnection';
import { InMemorySocketFake } from '../domain/socket/InMemorySocketFake';
import { Socket } from '../domain/socket/Socket';
import { ConnectedUsersMessage } from '../domain/typeGuards/connectedUsers';
import { ErrorMessage } from '../domain/typeGuards/error';
import { GameHasFinishedMessage } from '../domain/typeGuards/finished';
import { GameStateInfoMessage } from '../domain/typeGuards/gameStateInfo';
import { ObstacleMessage } from '../domain/typeGuards/obstacle';
import { GameHasPausedMessage } from '../domain/typeGuards/paused';
import { PlayerFinishedMessage } from '../domain/typeGuards/playerFinished';
import { GameHasResetMessage } from '../domain/typeGuards/reset';
import { GameHasResumedMessage } from '../domain/typeGuards/resumed';
import { GameHasStartedMessage } from '../domain/typeGuards/started';
import { GameHasStoppedMessage } from '../domain/typeGuards/stopped';
import { TimedOutMessage } from '../domain/typeGuards/timedOut';
import { UserInitMessage } from '../domain/typeGuards/userInit';
import { MessageTypes } from '../utils/constants';
import { GameContext } from './GameContextProvider';
import { PlayerContext } from './PlayerContextProvider';

// TODO move to better location
export type MessageData =
    | UserInitMessage
    | ObstacleMessage
    | GameFinished
    | ErrorMessage
    | PlayerFinishedMessage
    | TimedOutMessage
    | GameHasPausedMessage
    | GameHasStartedMessage
    | GameHasResumedMessage
    | GameHasStoppedMessage
    | GameHasResetMessage
    | ConnectedUsersMessage
    | undefined
    | GameHasFinishedMessage
    | GameStateInfoMessage;

export const defaultValue = {
    controllerSocket: new InMemorySocketFake(),
    setControllerSocket: () => {
        // do nothing
    },
    handleSocketConnection: () => {
        // do nothing
    },
};

interface IControllerSocketContext {
    controllerSocket: Socket;
    setControllerSocket: (val: Socket, roomId: string) => void;
    handleSocketConnection: (roomId: string, name: string) => void;
}

export const ControllerSocketContext = React.createContext<IControllerSocketContext>(defaultValue);

export interface GameFinished {
    type: MessageTypes.gameHasFinished;
    rank: number;
}

export interface IUser {
    id: string;
    name: string;
    roomId: string;
    number: number;
}

const ControllerSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [controllerSocket, setControllerSocket] = React.useState<Socket>(new InMemorySocketFake());
    const {
        setObstacle,
        setPlayerFinished,
        setPlayerRank,
        setIsPlayerAdmin,
        setPlayerNumber,
        setPermissionGranted,
        playerFinished,
        resetPlayer,
    } = React.useContext(PlayerContext);

    const { setGameStarted, setRoomId, setHasPaused, resetGame } = React.useContext(GameContext);

    const dependencies = {
        setControllerSocket,
        setPlayerNumber,
        setPlayerFinished,
        setObstacle,
        setPlayerRank,
        setGameStarted,
        setPlayerAdmin: setIsPlayerAdmin,
    };

    const content = {
        controllerSocket,
        setControllerSocket: (val: Socket, roomId: string) =>
            handleSetSocket(val, roomId, playerFinished, {
                ...dependencies,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            }),
        handleSocketConnection: (roomId: string, name: string) => {
            handleSocketConnection(roomId, name, playerFinished, {
                ...dependencies,
                setPermissionGranted,
                setRoomId,
                resetGame,
                resetPlayer,
                setHasPaused,
                history,
            });
        },
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
