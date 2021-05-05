import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { GameState, MessageTypes, Obstacles } from '../utils/constants';
import ScreenSocket from '../utils/screenSocket';
import { InMemorySocketFake } from '../utils/socket/InMemorySocketFake';
import { Socket } from '../utils/socket/Socket';
import { SocketIOAdapter } from '../utils/socket/SocketIOAdapter';
import { GameContext, IPlayerState } from './GameContextProvider';

export interface IObstacleMessage {
    type: string;
    obstacleType?: Obstacles;
}

interface IScreenSocketContext {
    screenSocket: Socket;
    setScreenSocket: (val: Socket, roomId: string) => void;
    isScreenConnected: boolean;
    handleSocketConnection: (val: string) => void;
}

export const defaultValue = {
    screenSocket: new InMemorySocketFake(),
    setScreenSocket: () => {
        // do nothing
    },
    isScreenConnected: false,
    handleSocketConnection: () => {
        // do nothing
    },
};

export const ScreenSocketContext = React.createContext<IScreenSocketContext>(defaultValue);

export interface IPlayerRank {
    id: number;
    name: string;
    rank?: number;
    finished: boolean;
    totalTimeInMs?: number;
    positionX: number;
}
interface IGameStateData {
    gameState: GameState;
    numberOfObstacles: number;
    roomId: string;
    trackLength: number;
    playersState?: IPlayerState[];
    playerRanks?: IPlayerRank[];
}

interface IGameState {
    data?: IGameStateData;
    type: string;
}

export interface IUser {
    id: string;
    name: string;
    roomId: string;
}

interface IGameStarted {
    type: string;
    countdownTime: number;
}

interface IConnectedUsers {
    type: string;
    users: IUser[];
}
const ScreenSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket>(new InMemorySocketFake());
    const [messageData, setMessageData] = React.useState<IGameState | IConnectedUsers | undefined>();
    const history = useHistory();

    const {
        setPlayers,
        setPlayerRanks,
        setTrackLength,
        finished,
        setFinished,
        trackLength,
        setGameStarted,
        roomId,
        setRoomId,
        setConnectedUsers,
        setCountdownTime,
        setHasTimedOut,
        setHasPaused,
    } = React.useContext(GameContext);

    React.useEffect(() => {
        if (messageData) {
            let data;

            switch (messageData.type) {
                case 'game1/gameState':
                    handleGameState(messageData as IGameState);
                    break;
                case MessageTypes.connectedUsers:
                    data = messageData as IConnectedUsers;
                    if (data.users) {
                        setConnectedUsers(data.users);
                    }
                    break;
                case 'game1/hasStarted':
                    data = messageData as IGameStarted;
                    setCountdownTime(data.countdownTime);
                    setGameStarted(true);
                    history.push(`/screen/${roomId}/game1`);
                    break;
                case MessageTypes.gameHasFinished:
                    handleGameHasFinished(messageData as IGameState);
                    break;
                case MessageTypes.gameHasReset:
                    history.push(`/screen/${roomId}/lobby`);
                    break;
                case MessageTypes.gameHasPaused:
                    setHasPaused(true);
                    break;
                case MessageTypes.gameHasResumed:
                    setHasPaused(false);
                    break;
                case MessageTypes.gameHasTimedOut:
                    setHasTimedOut(true);
                    handleGameHasFinished(messageData as IGameState);
                    break;
                case MessageTypes.gameHasStopped:
                    history.push(`/screen/${roomId}/lobby`);
                    break;
            }
        }

        function handleGameHasFinished(messageData: IGameState) {
            setFinished(true);
            setPlayerRanks(messageData.data!.playerRanks!);
            history.push(`/screen/${roomId}/finished`);
        }

        function handleGameState(messageData: IGameState) {
            if (messageData.data) {
                if (!trackLength) {
                    setTrackLength(messageData.data.trackLength);
                }
                if (!roomId) {
                    setRoomId(messageData.data.roomId);
                }

                if (messageData.data.playersState) {
                    setPlayers(messageData.data.playersState);
                }
            }
        }
    }, [
        finished,
        history,
        messageData,
        roomId,
        setConnectedUsers,
        setCountdownTime,
        setFinished,
        setGameStarted,
        setHasPaused,
        setHasTimedOut,
        setPlayerRanks,
        setPlayers,
        setRoomId,
        setTrackLength,
        trackLength,
    ]);

    function handleSocketConnection(roomId: string) {
        setRoomId(roomId);

        handleSetScreenSocket(new SocketIOAdapter(roomId, 'screen'), roomId);
    }

    function handleSetScreenSocket(socket: Socket, roomId: string) {
        setScreenSocket(socket);
        ScreenSocket.getInstance(socket);
        // TODO change any to IGameState | IConnectedUsers
        socket?.listen((data: any) => {
            setMessageData(data);
        });
        history.push(`/screen/${roomId}/lobby`);
    }

    const content = {
        screenSocket,
        setScreenSocket: (val: Socket, roomId: string) => handleSetScreenSocket(val, roomId),
        isScreenConnected: screenSocket ? true : false,
        handleSocketConnection,
    };
    return <ScreenSocketContext.Provider value={content}>{children}</ScreenSocketContext.Provider>;
};

export default ScreenSocketContextProvider;
