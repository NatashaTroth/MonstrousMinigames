import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { handleConnectedUsersMessage } from '../domain/commonGameState/screen/handleConnectedUsersMessage';
import { handleGameHasFinishedMessage } from '../domain/commonGameState/screen/handleGameHasFinishedMessage';
import { handleGameHasResetMessage } from '../domain/commonGameState/screen/handleGameHasResetMessage';
import { handleGameHasStoppedMessage } from '../domain/commonGameState/screen/handleGameHasStoppedMessage';
import { handleGameStartedMessage } from '../domain/commonGameState/screen/handleGameStartedMessage';
import { handleStartPhaserGameMessage } from '../domain/commonGameState/screen/handleStartPhaserGameMessage';
import { handleStartSheepGameMessage } from '../domain/game2/screen/gameState/handleStartSheepGameMessage';
import { handleSetSocket } from '../domain/socket/screen/handleSetSocket';
import { handleSocketConnection } from '../domain/socket/screen/handleSocketConnection';
import { Socket } from '../domain/socket/Socket';
import { GameState } from '../utils/constants';
import { Game3Context } from './game3/Game3ContextProvider';
import { GameContext } from './GameContextProvider';
import { Obstacle } from './PlayerContextProvider';

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
    points?: number;
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
        setTopicMessage,
        setRoundIdx,
        setVoteForPhotoMessage,
        setVotingResults,
        setFinalRoundCountdownTime,
        setPresentFinalPhotos,
    } = React.useContext(Game3Context);
    const {
        setGameStarted,
        setSheepGameStarted,
        setRoomId,
        setConnectedUsers,
        setHasPaused,
        setFinished,
        setPlayerRanks,
        setScreenAdmin,
        setScreenState,
        setChosenGame,
        setCountdownTime,
    } = React.useContext(GameContext);

    const dependencies = {
        setScreenSocket,
        setHasPaused,
        setScreenAdmin,
        setScreenState,
        setChosenGame,
        setTopicMessage,
        setRoundIdx,
        setVoteForPhotoMessage,
        setVotingResults,
        setFinalRoundCountdownTime,
        setPresentFinalPhotos,
        history,
        handleGameHasFinishedMessage: handleGameHasFinishedMessage({ setFinished, setPlayerRanks, history }),
        handleConnectedUsersMessage: handleConnectedUsersMessage({ setConnectedUsers }),
        handleStartPhaserGameMessage: handleStartPhaserGameMessage({ setGameStarted, history }),
        handleStartSheepGameMessage: handleStartSheepGameMessage({ setSheepGameStarted, history }),
        handleGameHasStoppedMessage: handleGameHasStoppedMessage({ history }),
        handleGameHasResetMessage: handleGameHasResetMessage({ history }),
        handleGameStartedMessage: handleGameStartedMessage({ history, setCountdownTime, setGameStarted }),
    };

    const content = {
        screenSocket,
        setScreenSocket: (socket: Socket, roomId: string, route: string) => {
            handleSetSocket(
                socket,
                roomId,
                {
                    ...dependencies,
                },
                route
            );
        },
        handleSocketConnection: (roomId: string, route: string) => {
            handleSocketConnection(roomId, route, {
                setRoomId,
                ...dependencies,
            });
        },
    };
    return <ScreenSocketContext.Provider value={content}>{children}</ScreenSocketContext.Provider>;
};

export default ScreenSocketContextProvider;
