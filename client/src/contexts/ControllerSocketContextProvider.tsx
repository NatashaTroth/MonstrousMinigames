import * as React from 'react';

import { Obstacles } from '../utils/constants';
import { handleSetControllerSocket } from '../utils/handleSetControllerSocket';
import { handleSocketConnection } from '../utils/handleSocketConnection';
import { GameContext } from './GameContextProvider';
import { PlayerContext } from './PlayerContextProvider';

export type MessageData = IUserInitMessage | IObstacleMessage | IGameFinished;

export const defaultValue = {
    controllerSocket: undefined,
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
    controllerSocket: SocketIOClient.Socket | undefined;
    isControllerConnected: boolean;
    setControllerSocket: (val: SocketIOClient.Socket | undefined, roomId: string) => void;
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
}

const ControllerSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [controllerSocket, setControllerSocket] = React.useState<SocketIOClient.Socket | undefined>(undefined);
    const {
        setObstacle,
        setPlayerFinished,
        setPlayerRank,
        setIsPlayerAdmin,
        setPlayerNumber,
        setPermissionGranted,
        playerFinished,
    } = React.useContext(PlayerContext);

    const { setGameStarted, setRoomId } = React.useContext(GameContext);

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
        setControllerSocket: (val: SocketIOClient.Socket | undefined, roomId: string) =>
            handleSetControllerSocket(val, roomId, playerFinished, {
                ...dependencies,
            }),
        isControllerConnected: controllerSocket ? true : false,
        handleSocketConnection: (roomId: string, name: string) => {
            handleSocketConnection(roomId, name, playerFinished, {
                ...dependencies,
                setPermissionGranted,
                setRoomId,
            });
        },
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
