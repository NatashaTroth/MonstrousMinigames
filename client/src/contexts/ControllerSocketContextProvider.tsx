import { stringify } from 'query-string';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { MessageTypes, Obstacles } from '../utils/constants';
import { ClickRequestDeviceMotion } from '../utils/permissions';
import { GameContext } from './GameContextProvider';
import { PlayerContext } from './PlayerContextProvider';

type MessageData = IUserInitMessage | IObstacleMessage | IGameFinished;

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

interface IUserInitMessage {
    name?: string;
    type?: string;
    userId?: 'userInit';
    roomId?: string;
    isAdmin?: boolean;
    number?: number;
}

interface IGameFinished {
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

    const { setGameStarted, roomId, setRoomId } = React.useContext(GameContext);

    const handleMessageData = React.useCallback(
        (data: MessageData) => {
            let messageData;

            switch (data.type) {
                case MessageTypes.userInit:
                    messageData = data as IUserInitMessage;
                    sessionStorage.setItem('userId', messageData.userId || '');
                    localStorage.setItem('name', messageData.name || '');
                    sessionStorage.setItem('roomId', messageData.roomId || '');
                    setIsPlayerAdmin(messageData.isAdmin || false);
                    setPlayerNumber(messageData.number || 0);
                    break;
                case 'game1/obstacle':
                    messageData = data as IObstacleMessage;
                    setObstacle({ type: messageData.obstacleType, id: messageData.obstacleId });

                    break;
                case 'game1/playerFinished':
                    messageData = data as IGameFinished;
                    if (!playerFinished) {
                        setPlayerFinished(true);
                        setPlayerRank(messageData.rank);
                    }
                    break;
                case 'game1/hasStarted':
                    document.body.style.overflow = 'hidden';
                    document.body.style.position = 'fixed';
                    setGameStarted(true);

                    history.push(`/controller/${roomId}/game1`);
                    break;
                case MessageTypes.gameHasReset:
                    history.push(`/controller/${roomId}/lobby`);
                    break;
                case MessageTypes.gameHasTimedOut:
                    messageData = data as IGameFinished;
                    setPlayerFinished(true);
                    setPlayerRank(messageData.rank);
                    break;
                default:
                    break;
            }
        },
        [
            history,
            playerFinished,
            roomId,
            setGameStarted,
            setIsPlayerAdmin,
            setObstacle,
            setPlayerFinished,
            setPlayerNumber,
            setPlayerRank,
        ]
    );

    function handleSetControllerSocket(socket: SocketIOClient.Socket | undefined, roomId: string) {
        setControllerSocket(socket);
        if (socket) {
            socket.on('message', (data: MessageData) => handleMessageData(data));
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
