import * as React from 'react';

import { connectedUsersHandler } from '../domain/commonGameState/controller/connectedUsersHandler';
import { gameFinishedHandler } from '../domain/commonGameState/controller/gameFinishedHandler';
import { playerFinishedHandler } from '../domain/commonGameState/controller/handlePlayerFinishedMessage';
import { resetHandler } from '../domain/commonGameState/controller/resetHandler';
import { startedHandler } from '../domain/commonGameState/controller/startedHandler';
import { stopHandler } from '../domain/commonGameState/controller/stopHandler';
import { userInitHandler } from '../domain/commonGameState/controller/userInitHandler';
import { gameSetHandler } from '../domain/commonGameState/gameSetHandler';
import { pauseHandler } from '../domain/commonGameState/pauseHandler';
import { resumeHandler } from '../domain/commonGameState/resumeHandler';
import addMovementListener from '../domain/game1/controller/gameState/addMovementListener';
import { approachingObstacleHandler } from '../domain/game1/controller/gameState/approachingObstacleHandler';
import { diedHandler } from '../domain/game1/controller/gameState/diedHandler';
import { exceededMaxChaserPushesHandler } from '../domain/game1/controller/gameState/exceededMaxChaserPushesHandler';
import { obstacleHandler } from '../domain/game1/controller/gameState/obstacleHandler';
import { stunnablePlayersHandler } from '../domain/game1/controller/gameState/stunnablePlayersHandler';
import { stunnedHandler } from '../domain/game1/controller/gameState/stunnedHandler';
import { unstunnedHandler } from '../domain/game1/controller/gameState/unstunnedHandler';
import { finalRoundCountdownHandler } from '../domain/game3/controller/gameState/finalRoundCountdownHandler';
import { newRoundHandler } from '../domain/game3/controller/gameState/newRoundHandler';
import { presentFinalPhotosHandler } from '../domain/game3/controller/gameState/presentFinalPhotosHandler';
import { topicHandler } from '../domain/game3/controller/gameState/topicHandler';
import { voteForFinalPhotosHandler } from '../domain/game3/controller/gameState/voteForFinalPhotosHandler';
import { voteForPhotoHandler } from '../domain/game3/controller/gameState/voteForPhotoHandler';
import { votingResultsHandler } from '../domain/game3/controller/gameState/votingResultsHandler';
import history from '../domain/history/history';
import { InMemorySocketFake } from '../domain/socket/InMemorySocketFake';
import { Socket } from '../domain/socket/Socket';
import { SocketIOAdapter } from '../domain/socket/SocketIOAdapter';
import { localStorage } from '../domain/storage/LocalStorage';
import { sessionStorage } from '../domain/storage/SessionStorage';
import { persistUser } from '../domain/user/persistUser';
import { controllerChooseCharacterRoute } from '../utils/routes';
import { Game1Context } from './game1/Game1ContextProvider';
import { Game3Context } from './game3/Game3ContextProvider';
import { GameContext } from './GameContextProvider';
import { PlayerContext } from './PlayerContextProvider';

export const defaultValue = {
    controllerSocket: new InMemorySocketFake(),
    handleSocketConnection: () => {
        // do nothing
    },
};

interface ControllerSocketContextProps {
    controllerSocket: Socket;
    handleSocketConnection: (roomId: string, name: string) => void;
}

export const ControllerSocketContext = React.createContext<ControllerSocketContextProps>(defaultValue);

interface ControllerSocketContextProviderProps {
    permission: boolean;
}

const ControllerSocketContextProvider: React.FunctionComponent<ControllerSocketContextProviderProps> = ({
    children,
    permission,
}) => {
    const [controllerSocket, setControllerSocket] = React.useState<Socket>(new InMemorySocketFake());
    const {
        setObstacle,
        setPlayerFinished,
        playerFinished,
        setEarlySolvableObstacle,
        setExceededChaserPushes,
        setPlayerDead,
        setStunnablePlayers,
    } = React.useContext(Game1Context);
    const { setPlayerRank, setPlayerNumber, setName, setUserId, setReady, playerRank, resetPlayer } = React.useContext(
        PlayerContext
    );

    const {
        setVoteForPhotoMessage,
        setRoundIdx,
        setTopicMessage,
        setVotingResults,
        setFinalRoundCountdownTime,
        setPresentFinalPhotos,
        resetGame3,
    } = React.useContext(Game3Context);

    const {
        setGameStarted,
        setRoomId,
        setHasPaused,
        setAvailableCharacters,
        setConnectedUsers,
        hasPaused,
        setChosenGame,
        setCountdownTime,
    } = React.useContext(GameContext);

    React.useEffect(() => {
        if (permission) {
            addMovementListener(controllerSocket, hasPaused, playerFinished);
        }
    }, [permission, hasPaused, playerFinished, controllerSocket]);

    const persistUserWithDependencies = persistUser({
        localStorage,
        sessionStorage,
    });

    const userInitHandlerWithDependencies = userInitHandler({
        setPlayerNumber,
        setName,
        setUserId,
        setReady,
        persistUser: persistUserWithDependencies,
    });

    const connectedUserHandlerWithDependencies = connectedUsersHandler({
        setAvailableCharacters,
        setConnectedUsers,
    });

    const pausedHandlerWithDependencies = pauseHandler({
        setHasPaused,
    });

    const resumeHandlerWithDependencies = resumeHandler({
        setHasPaused,
    });

    const gameSetHandlerWithDependencies = gameSetHandler({
        setChosenGame,
    });

    const stopHandlerWithDependencies = stopHandler({
        history,
    });

    const startedHandlerWithDependencies = startedHandler({ setGameStarted, history, setCountdownTime });

    const resetHandlerWithDependencies = resetHandler({
        resetController: () => {
            resetGame3(), resetPlayer();
        },
        history,
    });

    const gameFinishedHandlerWithDependencies = gameFinishedHandler({ setPlayerRank, history, playerRank });

    const obstacleHandlerWithDependencies = obstacleHandler({ setObstacle });

    const stunnedHandlerWithDependencies = stunnedHandler({ history });
    const unstunnedHandlerWithDependencies = unstunnedHandler({ history });

    const playerFinishedHandlerWithDependencies = playerFinishedHandler({
        setPlayerFinished,
        setPlayerRank,
        playerFinished,
    });

    const stunnablePlayersHandlerWithDependencies = stunnablePlayersHandler({ setStunnablePlayers });

    const diedHandlerWithDependencies = diedHandler({ setPlayerDead, setPlayerRank });

    const approachingObstacleHandlerWithDependencies = approachingObstacleHandler({ setEarlySolvableObstacle });

    const exceededMaxChaserPushesHandlerWithDependencies = exceededMaxChaserPushesHandler({ setExceededChaserPushes });

    const voteForPhotoHandlerWithDependencies = voteForPhotoHandler({ setVoteForPhotoMessage, history });
    const newRoundHandlerWithDependencies = newRoundHandler({
        setRoundIdx,
        setVoteForPhotoMessage,
        setVotingResults,
        history,
    });
    const topicHandlerWithDependencies = topicHandler({ setTopicMessage });
    const votingResultsHandlerWithDependencies = votingResultsHandler({ setVotingResults });
    const finalRoundCountdownHandlerWithDependencies = finalRoundCountdownHandler({ setFinalRoundCountdownTime });
    const presentFinalPhotosHandlerWithDependencies = presentFinalPhotosHandler({ setPresentFinalPhotos, history });
    const voteForFinalPhotosHandlerWithDependencies = voteForFinalPhotosHandler({ setVoteForPhotoMessage, history });

    const content = {
        controllerSocket,
        handleSocketConnection: (roomId: string, name: string) => {
            setRoomId(roomId);

            const socket = new SocketIOAdapter(roomId, 'controller', name);

            if (socket) {
                setControllerSocket(socket);
                userInitHandlerWithDependencies(socket, roomId);
                connectedUserHandlerWithDependencies(socket, roomId);
                pausedHandlerWithDependencies(socket, roomId);
                resumeHandlerWithDependencies(socket, roomId);
                gameSetHandlerWithDependencies(socket, roomId);
                stopHandlerWithDependencies(socket, roomId);
                startedHandlerWithDependencies(socket, roomId);
                resetHandlerWithDependencies(socket, roomId);
                gameFinishedHandlerWithDependencies(socket, roomId);
                obstacleHandlerWithDependencies(socket, roomId);
                stunnedHandlerWithDependencies(socket, roomId);
                unstunnedHandlerWithDependencies(socket, roomId);
                playerFinishedHandlerWithDependencies(socket, roomId);
                stunnablePlayersHandlerWithDependencies(socket, roomId);
                diedHandlerWithDependencies(socket, roomId);
                approachingObstacleHandlerWithDependencies(socket, roomId);
                exceededMaxChaserPushesHandlerWithDependencies(socket, roomId);
                voteForPhotoHandlerWithDependencies(socket, roomId);
                newRoundHandlerWithDependencies(socket, roomId);
                topicHandlerWithDependencies(socket, roomId);
                votingResultsHandlerWithDependencies(socket, roomId);
                finalRoundCountdownHandlerWithDependencies(socket, roomId);
                presentFinalPhotosHandlerWithDependencies(socket, roomId);
                voteForFinalPhotosHandlerWithDependencies(socket, roomId);
            }
            history.push(controllerChooseCharacterRoute(roomId));
        },
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
