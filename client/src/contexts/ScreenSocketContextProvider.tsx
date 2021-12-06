import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { gameSetHandler } from '../domain/commonGameState/gameSetHandler';
import { pauseHandler } from '../domain/commonGameState/pauseHandler';
import { resumeHandler } from '../domain/commonGameState/resumeHandler';
import { connectedUsersHandler } from '../domain/commonGameState/screen/connectedUsersHandler';
import { finishedHandler } from '../domain/commonGameState/screen/finishedHandler';
import { resetHandler } from '../domain/commonGameState/screen/resetHandler';
import { screenAdminHandler } from '../domain/commonGameState/screen/screenAdminHandler';
import { screenStateHandler } from '../domain/commonGameState/screen/screenStateHandler';
import { startHandler } from '../domain/commonGameState/screen/startHandler';
import { stopHandler } from '../domain/commonGameState/screen/stopHandler';
import { startPhaserGameHandler } from '../domain/game1/screen/gameState/startPhaserGameHandler';
import { startSheepGameHandler } from '../domain/game2/screen/gameState/startSheepGameHandler';
import { finalRoundCountdownHandler } from '../domain/game3/controller/gameState/finalRoundCountdownHandler';
import { topicHandler } from '../domain/game3/controller/gameState/topicHandler';
import { votingResultsHandler } from '../domain/game3/controller/gameState/votingResultsHandler';
import { newRoundHandler } from '../domain/game3/screen/gameState/newRoundHandler';
import { presentFinalPhotosHandler } from '../domain/game3/screen/gameState/presentFinalPhotosHandler';
import { voteForFinalPhotosHandler } from '../domain/game3/screen/gameState/voteForFinalPhotosHandler';
import { voteForPhotoHandler } from '../domain/game3/screen/gameState/voteForPhotoHandler';
import ScreenSocket from '../domain/socket/screenSocket';
import { Socket } from '../domain/socket/Socket';
import { SocketIOAdapter } from '../domain/socket/SocketIOAdapter';
import { GameState } from '../utils/constants';
import { Routes } from '../utils/routes';
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

    const finishedHandlerWithDependencies = finishedHandler({ setFinished, setPlayerRanks, history });
    const topicHandlerWithDependencies = topicHandler({ setTopicMessage });
    const votingResultsHandlerWithDependencies = votingResultsHandler({ setVotingResults });
    const finalRoundCountdownHandlerWithDependencies = finalRoundCountdownHandler({ setFinalRoundCountdownTime });
    const connectedUsersHandlerWithDependencies = connectedUsersHandler({ setConnectedUsers });
    const startPhaserGameHandlerWithDependencies = startPhaserGameHandler({ setGameStarted, history });
    const startSheepGameHandlerWithDependencies = startSheepGameHandler({ setSheepGameStarted, history });
    const pauseHandlerWithDependencies = pauseHandler({ setHasPaused });
    const resumeHandlerWithDependencies = resumeHandler({ setHasPaused });
    const stopHandlerWithDependencies = stopHandler({ history });
    const resetHandlerWithDependencies = resetHandler({ history });
    const adminHandlerWithDependencies = screenAdminHandler({ setScreenAdmin });
    const screenStateHandlerWithDependencies = screenStateHandler({ setScreenState });
    const startHandlerWithDependencies = startHandler({ history, setCountdownTime, setGameStarted });
    const gameSetHandlerWithDependencies = gameSetHandler({ setChosenGame });
    const newRoundHandlerWithDependencies = newRoundHandler({ setRoundIdx, setVoteForPhotoMessage, setVotingResults });
    const voteForPhotoHandlerWithDependencies = voteForPhotoHandler({ setVoteForPhotoMessage });
    const voteForFinalPhotosHandlerWithDependencies = voteForFinalPhotosHandler({
        setPresentFinalPhotos,
        setVoteForPhotoMessage,
    });
    const presentFinalPhotosHandlerWithDependencies = presentFinalPhotosHandler({ setPresentFinalPhotos });

    const content = {
        screenSocket,
        handleSocketConnection: (roomId: string, route: string) => {
            setRoomId(roomId);
            sessionStorage.setItem('roomId', roomId);

            const socket = new SocketIOAdapter(roomId, 'screen');

            if (socket) {
                setScreenSocket(socket);
                ScreenSocket.getInstance(socket);

                finishedHandlerWithDependencies(socket, roomId);
                topicHandlerWithDependencies(socket, roomId);
                votingResultsHandlerWithDependencies(socket, roomId);
                finalRoundCountdownHandlerWithDependencies(socket, roomId);
                connectedUsersHandlerWithDependencies(socket, roomId);
                startPhaserGameHandlerWithDependencies(socket, roomId);
                startSheepGameHandlerWithDependencies(socket, roomId);
                pauseHandlerWithDependencies(socket, roomId);
                resumeHandlerWithDependencies(socket, roomId);
                stopHandlerWithDependencies(socket, roomId);
                resetHandlerWithDependencies(socket, roomId);
                adminHandlerWithDependencies(socket, roomId);
                screenStateHandlerWithDependencies(socket, roomId);
                startHandlerWithDependencies(socket, roomId);
                gameSetHandlerWithDependencies(socket, roomId);
                newRoundHandlerWithDependencies(socket, roomId);
                voteForPhotoHandlerWithDependencies(socket, roomId);
                voteForFinalPhotosHandlerWithDependencies(socket, roomId);
                presentFinalPhotosHandlerWithDependencies(socket, roomId);

                history.push(`${Routes.screen}/${roomId}/${route || Routes.lobby}`);
            }
        },
    };
    return <ScreenSocketContext.Provider value={content}>{children}</ScreenSocketContext.Provider>;
};

export default ScreenSocketContextProvider;
