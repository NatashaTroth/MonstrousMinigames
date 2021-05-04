import { stringify } from 'query-string';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { Obstacles } from '../utils/constants';
import { handleMessageData } from '../utils/handleMessageData';
import { ClickRequestDeviceMotion } from '../utils/permissions';
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
    const history = useHistory();

    const { setGameStarted, setRoomId } = React.useContext(GameContext);

    function handleSetControllerSocket(socket: SocketIOClient.Socket | undefined, roomId: string) {
        setControllerSocket(socket);
        if (socket) {
            socket.on('message', (data: MessageData) =>
                handleMessageData({
                    data,
                    playerFinished,
                    roomId,
                    dependencies: {
                        setPlayerAdmin: setIsPlayerAdmin,
                        setPlayerNumber,
                        setPlayerFinished,
                        setObstacle,
                        setPlayerRank,
                        setGameStarted,
                    },
                })
            );
            history.push(`/controller/${roomId}/lobby`);
        }
    }

    async function handleSocketConnection(roomId: string, name: string) {
        const permission = await ClickRequestDeviceMotion();
        if (permission) {
            setPermissionGranted(permission);
        }

        const controllerSocket = io(
            `${process.env.REACT_APP_BACKEND_URL}controller?${stringify({
                name: name,
                roomId: roomId,
                userId: sessionStorage.getItem('userId') || '',
            })}`,
            {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
            }
        );

        setRoomId(roomId || '');

        controllerSocket.on('connect', () => {
            if (controllerSocket) {
                handleSetControllerSocket(controllerSocket, roomId || '');
            }
        });
    }

    const content = {
        controllerSocket,
        setControllerSocket: (val: SocketIOClient.Socket | undefined, roomId: string) =>
            handleSetControllerSocket(val, roomId),
        isControllerConnected: controllerSocket ? true : false,
        handleSocketConnection,
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
