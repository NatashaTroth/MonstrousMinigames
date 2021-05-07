import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { handleMessageData, IPlayerState, MessageData } from '../components/Screen/handleMessageData';
import { GameState, Obstacles } from '../utils/constants';
import ScreenSocket from '../utils/screenSocket';
import { Socket } from '../utils/socket/Socket';
import { SocketIOAdapter } from '../utils/socket/SocketIOAdapter';
import { GameContext } from './GameContextProvider';

export interface IObstacleMessage {
    type: string;
    obstacleType?: Obstacles;
}

interface IScreenSocketContext {
    screenSocket: Socket | undefined;
    handleSocketConnection: (val: string, route: string) => void;
}

export const defaultValue = {
    screenSocket: undefined,
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
    number: number;
}

const ScreenSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket>();
    const history = useHistory();

    const {
        setPlayerRanks,
        setFinished,
        setGameStarted,
        roomId,
        setRoomId,
        setConnectedUsers,
        setCountdownTime,
        setHasTimedOut,
        setHasPaused,
    } = React.useContext(GameContext);

    function handleGameHasFinished(messageData: IGameState) {
        setFinished(true);
        setPlayerRanks(messageData.data!.playerRanks!);
        // history.push(`/screen/${roomId}/finished`);
    }

    function handleSocketConnection(roomId: string, route: string) {
        setRoomId(roomId);
        sessionStorage.setItem('roomId', roomId);

        handleSetScreenSocket(new SocketIOAdapter(roomId, 'screen'), roomId, route);
    }

    function handleSetScreenSocket(socket: Socket, roomId: string, route: string) {
        setScreenSocket(socket);
        ScreenSocket.getInstance(socket);
        // TODO change any to IGameState | IConnectedUsers
        socket?.listen((data: any) => {
            handleMessageData({
                messageData: data as MessageData,
                roomId,
                dependencies: {
                    setHasPaused,
                    handleGameHasFinished,
                    setGameStarted,
                    setCountdownTime,
                    setConnectedUsers,
                    setHasTimedOut,
                },
            });
        });
        history.push(`/screen/${roomId}/${route}`);
    }

    const content = {
        screenSocket,
        handleSocketConnection,
    };
    return <ScreenSocketContext.Provider value={content}>{children}</ScreenSocketContext.Provider>;
};

export default ScreenSocketContextProvider;
