import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { handleSetSocket } from '../domain/screen/socket/handleSetSocket';
import { handleSocketConnection } from '../domain/screen/socket/handleSocketConnection';
import { Socket } from '../domain/socket/Socket';
import { GameState, Obstacles } from '../utils/constants';
import { GameContext } from './GameContextProvider';
import { Obstacle } from './PlayerContextProvider';

export interface ObstacleMessage {
    type: string;
    obstacleType?: Obstacles;
}

interface ScreenSocketContextProps {
    screenSocket: Socket | undefined;
    handleSocketConnection: (val: string, route: string) => void;
}

export const defaultValue = {
    screenSocket: undefined,
    handleSocketConnection: () => {
        // do nothing
    },
};

export const ScreenSocketContext = React.createContext<ScreenSocketContextProps>(defaultValue);

export interface PlayerRank {
    id: string;
    name: string;
    rank?: number;
    finished: boolean;
    totalTimeInMs?: number;
    positionX: number;
    isActive: boolean;
    dead: boolean;
}

export interface PlayerState {
    id: string;
    name: string;
    positionX: number;
    obstacles: Obstacle[];
    atObstacle: boolean;
    finished: boolean;
    finishedTimeMs: number;
    rank: number;
    isActive: boolean;
}

export interface GameStateData {
    gameState: GameState;
    numberOfObstacles: number;
    roomId: string;
    trackLength: number;
    playersState: PlayerState[];
    playerRanks: PlayerRank[];
}

export interface User {
    id: string;
    name: string;
    roomId: string;
    number: number;
    ready: boolean;
}

const ScreenSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket>();
    const history = useHistory();

    const {
        setGameStarted,
        setRoomId,
        setConnectedUsers,
        setCountdownTime,
        setHasPaused,
        setFinished,
        setPlayerRanks,
        setScreenAdmin,
    } = React.useContext(GameContext);

    const content = {
        screenSocket,
        setScreenSocket: (socket: Socket, roomId: string, route: string) => {
            handleSetSocket(
                socket,
                roomId,
                {
                    setScreenSocket,
                    setConnectedUsers,
                    setHasPaused,
                    setGameStarted,
                    setCountdownTime,
                    setFinished,
                    setPlayerRanks,
                    setScreenAdmin,
                    history,
                },
                route
            );
        },
        handleSocketConnection: (roomId: string, route: string) => {
            handleSocketConnection(roomId, route, {
                setRoomId,
                setScreenSocket,
                setConnectedUsers,
                setHasPaused,
                setGameStarted,
                setCountdownTime,
                setFinished,
                setPlayerRanks,
                setScreenAdmin,
                history,
            });
        },
    };
    return <ScreenSocketContext.Provider value={content}>{children}</ScreenSocketContext.Provider>;
};

export default ScreenSocketContextProvider;
