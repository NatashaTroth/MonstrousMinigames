import * as React from "react";

import {
    handleConnectedUsersMessage
} from "../domain/commonGameState/controller/handleConnectedUsersMessage";
import {
    handleGameHasFinishedMessage
} from "../domain/commonGameState/controller/handleGameHasFinishedMessage";
import {
    handleGameHasResetMessage
} from "../domain/commonGameState/controller/handleGameHasResetMessage";
import {
    handleGameHasStoppedMessage
} from "../domain/commonGameState/controller/handleGameHasStoppedMessage";
import {
    handleGameStartedMessage
} from "../domain/commonGameState/controller/handleGameStartedMessage";
import {
    handlePlayerFinishedMessage
} from "../domain/commonGameState/controller/handlePlayerFinishedMessage";
import { userInitHandler } from "../domain/commonGameState/controller/userInitHandler";
import addMovementListener from "../domain/game1/controller/gameState/addMovementListener";
import {
    handleApproachingObstacleMessage
} from "../domain/game1/controller/gameState/handleApproachingSolvableObstacleMessage";
import { handleObstacleMessage } from "../domain/game1/controller/gameState/handleObstacleMessage";
import { handlePlayerDied } from "../domain/game1/controller/gameState/handlePlayerDied";
import {
    handleStunnablePlayers
} from "../domain/game1/controller/gameState/handleStunnablePlayers";
import history from "../domain/history/history";
import { handleSetSocket } from "../domain/socket/controller/handleSetSocket";
import { handleSocketConnection } from "../domain/socket/controller/handleSocketConnection";
import { InMemorySocketFake } from "../domain/socket/InMemorySocketFake";
import { Socket } from "../domain/socket/Socket";
import { localStorage } from "../domain/storage/LocalStorage";
import { sessionStorage } from "../domain/storage/SessionStorage";
import { persistUser } from "../domain/user/persistUser";
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
        history,
        setControllerSocket,
        setHasPaused,
        setExceededChaserPushes,
        setChosenGame,
        setVoteForPhotoMessage,
        setRoundIdx,
        setTopicMessage,
        setVotingResults,
        setFinalRoundCountdownTime,
        setPresentFinalPhotos,
        handleConnectedUsersMessage: handleConnectedUsersMessage({ setAvailableCharacters, setConnectedUsers }),
        handleGameStartedMessage: handleGameStartedMessage({ setGameStarted, history, setCountdownTime }),
        handleGameHasStoppedMessage: handleGameHasStoppedMessage({ history }),
        handleGameHasFinishedMessage: handleGameHasFinishedMessage({ setPlayerRank, history, playerRank }),
        handleObstacleMessage: handleObstacleMessage({ setObstacle }),
        handlePlayerFinishedMessage: handlePlayerFinishedMessage({ setPlayerFinished, setPlayerRank }),
        handleStunnablePlayers: handleStunnablePlayers({ setStunnablePlayers }),
        handlePlayerDied: handlePlayerDied({ setPlayerDead, setPlayerRank }),
        handleGameHasResetMessage: handleGameHasResetMessage({
            resetController: () => {
                resetGame3(), resetPlayer();
            },
            history,
        }),
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

    const content = {
        controllerSocket,
        setControllerSocket: (socket: Socket, roomId: string) => {
            // TODO remove maybe
            userInitHandlerWithDependencies(socket);
            handleSetSocket(socket, roomId, playerFinished, dependencies);
        },
        handleSocketConnection: (roomId: string, name: string) => {
            handleSocketConnection(roomId, name, playerFinished, dependencies);
        },
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
