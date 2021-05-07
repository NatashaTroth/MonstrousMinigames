import * as React from 'react';

import history from '../domain/history/history';
import { handleSetControllerSocket } from '../domain/socket/handleSetControllerSocket';
import { handleSocketConnection } from '../domain/socket/handleSocketConnection';
import { InMemorySocketFake } from '../domain/socket/InMemorySocketFake';
import { Socket } from '../domain/socket/Socket';
import { Obstacles } from '../utils/constants';
import { GameContext } from './GameContextProvider';
import { PlayerContext } from './PlayerContextProvider';

export interface IError {
    type: string;
    name: string;
}
export type MessageData = IUserInitMessage | IObstacleMessage | IGameFinished | IError;

export const defaultValue = {
    controllerSocket: new InMemorySocketFake(),
    setControllerSocket: () => {
        // do nothing
    },
    isControllerConnected: false,
    handleSocketConnection: () => {
        // do nothing
    },
};
export interface IObstacleMessage {
    type: string;
    obstacleType: Obstacles;
    obstacleId: number;
}
interface IControllerSocketContext {
    controllerSocket: Socket;
    isControllerConnected: boolean;
    setControllerSocket: (val: Socket, roomId: string) => void;
    handleSocketConnection: (roomId: string, name: string) => void;
}

export const ControllerSocketContext = React.createContext<IControllerSocketContext>(defaultValue);

export interface IUserInitMessage {
    name?: string;
    type?: string;
    userId?: string;
    roomId?: string;
    isAdmin: boolean;
    number: number;
}

export interface IGameFinished {
    type: string;
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
            handleSetControllerSocket(val, roomId, playerFinished, {
                ...dependencies,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            }),
        isControllerConnected: controllerSocket ? true : false,
        handleSocketConnection: (roomId: string, name: string) => {
            handleSocketConnection(roomId, name, playerFinished, {
                ...dependencies,
                setPermissionGranted,
                setRoomId,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            });
        },
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
