import * as React from "react";

import { connectedUsersHandler } from "../domain/commonGameState/controller/connectedUsersHandler";
import { gameFinishedHandler } from "../domain/commonGameState/controller/gameFinishedHandler";
import {
    handlePlayerFinishedMessage
} from "../domain/commonGameState/controller/handlePlayerFinishedMessage";
import { resetHandler } from "../domain/commonGameState/controller/resetHandler";
import { startedHandler } from "../domain/commonGameState/controller/startedHandler";
import { stopHandler } from "../domain/commonGameState/controller/stopHandler";
import { userInitHandler } from "../domain/commonGameState/controller/userInitHandler";
import { gameSetHandler } from "../domain/commonGameState/gameSetHandler";
import { pauseHandler } from "../domain/commonGameState/pauseHandler";
import { resumeHandler } from "../domain/commonGameState/resumeHandler";
import addMovementListener from "../domain/game1/controller/gameState/addMovementListener";
import {
    handleApproachingObstacleMessage
} from "../domain/game1/controller/gameState/handleApproachingSolvableObstacleMessage";
import { handlePlayerDied } from "../domain/game1/controller/gameState/handlePlayerDied";
import {
    handleStunnablePlayers
} from "../domain/game1/controller/gameState/handleStunnablePlayers";
import { obstacleHandler } from "../domain/game1/controller/gameState/obstacleHandler";
import { stunnedHandler } from "../domain/game1/controller/gameState/stunnedHandler";
import { unstunnedHandler } from "../domain/game1/controller/gameState/unstunnedHandler";
import history from "../domain/history/history";
import { handleSetSocket } from "../domain/socket/controller/handleSetSocket";
import { handleSocketConnection } from "../domain/socket/controller/handleSocketConnection";
import { InMemorySocketFake } from "../domain/socket/InMemorySocketFake";
import { Socket } from "../domain/socket/Socket";
import { localStorage } from "../domain/storage/LocalStorage";
import { sessionStorage } from "../domain/storage/SessionStorage";
import { persistUser } from "../domain/user/persistUser";
import { controllerChooseCharacterRoute } from "../utils/routes";
import { Game1Context } from "./game1/Game1ContextProvider";
import { Game3Context } from "./game3/Game3ContextProvider";
import { GameContext } from "./GameContextProvider";
import { PlayerContext } from "./PlayerContextProvider";

export const defaultValue = {
    controllerSocket: new InMemorySocketFake(),
    setControllerSocket: () => {
        // do nothing
    },
    handleSocketConnection: () => {
        // do nothing
    },
};

interface ControllerSocketContextProps {
    controllerSocket: Socket;
    setControllerSocket: (val: Socket, roomId: string) => void;
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

    const dependencies = {
        setExceededChaserPushes,
        setVoteForPhotoMessage,
        setRoundIdx,
        setTopicMessage,
        setVotingResults,
        setFinalRoundCountdownTime,
        setPresentFinalPhotos,
        handlePlayerFinishedMessage: handlePlayerFinishedMessage({ setPlayerFinished, setPlayerRank }),
        handleStunnablePlayers: handleStunnablePlayers({ setStunnablePlayers }),
        handlePlayerDied: handlePlayerDied({ setPlayerDead, setPlayerRank }),
        handleApproachingObstacleMessage: handleApproachingObstacleMessage({ setEarlySolvableObstacle }),
        setRoomId,
    };

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

    const content = {
        controllerSocket,
        setControllerSocket: (socket: Socket, roomId: string) => {
            // TODO remove maybe
            setControllerSocket(socket);
            userInitHandlerWithDependencies(socket);
            connectedUserHandlerWithDependencies(socket);
            pausedHandlerWithDependencies(socket);
            resumeHandlerWithDependencies(socket);
            gameSetHandlerWithDependencies(socket);
            stopHandlerWithDependencies(socket, roomId);
            startedHandlerWithDependencies(socket, roomId);
            resetHandlerWithDependencies(socket, roomId);
            gameFinishedHandlerWithDependencies(socket, roomId);
            obstacleHandlerWithDependencies(socket, roomId);
            stunnedHandlerWithDependencies(socket, roomId);
            unstunnedHandlerWithDependencies(socket, roomId);
            handleSetSocket(socket, roomId, playerFinished, dependencies);
            history.push(controllerChooseCharacterRoute(roomId));
        },
        handleSocketConnection: (roomId: string, name: string) => {
            handleSocketConnection(roomId, name, playerFinished, dependencies);
        },
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
