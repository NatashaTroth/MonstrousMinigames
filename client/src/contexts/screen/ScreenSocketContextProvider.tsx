import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { InMemorySocketFake } from '../../domain/socket/InMemorySocketFake';
import ScreenSocket from '../../domain/socket/screenSocket';
import { Socket } from '../../domain/socket/Socket';
import { SocketIOAdapter } from '../../domain/socket/SocketIOAdapter';
import { Routes } from '../../utils/routes';
import { GameContext } from '../GameContextProvider';
import { useGame1Handler } from './useGame1Handler';
import { useGame2Handler } from './useGame2Handler';
import { useGame3Handler } from './useGame3Handler';
import { useGameHandler } from './useGameHandler';

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
    positionX?: number;
    isActive: boolean;
    dead?: boolean;
    // TODO weg?
    points?: number;
    votes?: number;
}

export interface GamePlayed {
    game: GameType;
    playerRanks: PlayerRank[];
}

export enum GameType {
    GameOne = 'The Great Monster Escape',
    GameTwo = 'Kill sheep',
    GameThree = 'Snapshot Marathon',
}

export interface UserPoints {
    userId: string;
    name: string;
    points: number;
    rank: number;
}

export interface LeaderboardState {
    gameHistory: GamePlayed[];
    userPoints: UserPoints[]; //sorted by points
}

const ScreenSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket>(new InMemorySocketFake());

    useGameHandler(screenSocket);
    useGame1Handler(screenSocket);
    useGame2Handler(screenSocket);
    useGame3Handler(screenSocket);

    const history = useHistory();
    const { setRoomId } = React.useContext(GameContext);

    const content = {
        screenSocket,
        handleSocketConnection: (roomId: string, route: string) => {
            setRoomId(roomId);
            sessionStorage.setItem('roomId', roomId);

            const socket = new SocketIOAdapter(roomId, 'screen');

            if (socket) {
                setScreenSocket(socket);
                ScreenSocket.getInstance(socket);

                history.push(`${Routes.screen}/${roomId}/${route || Routes.lobby}`);
            }
        },
    };
    return <ScreenSocketContext.Provider value={content}>{children}</ScreenSocketContext.Provider>;
};

export default ScreenSocketContextProvider;
