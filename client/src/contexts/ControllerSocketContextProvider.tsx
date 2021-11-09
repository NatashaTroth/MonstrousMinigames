import * as React from 'react';

import addMovementListener from '../domain/game1/controller/gameState/addMovementListener';
import history from '../domain/history/history';
import { handleSetSocket } from '../domain/socket/controller/handleSetSocket';
import { handleSocketConnection } from '../domain/socket/controller/handleSocketConnection';
import { InMemorySocketFake } from '../domain/socket/InMemorySocketFake';
import { Socket } from '../domain/socket/Socket';
import { Game1Context } from './game1/Game1ContextProvider';
import { Game3Context } from './game3/Game3ContextProvider';
import { GameContext } from './GameContextProvider';
import { PlayerContext } from './PlayerContextProvider';

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
    const { setPlayerRank, setPlayerNumber, setName, setUserId, setReady, playerRank } = React.useContext(
        PlayerContext
    );

    const { setPhotos, setVoteForPhotoMessage, setRoundIdx, setTopicMessage } = React.useContext(Game3Context);

    const {
        setGameStarted,
        setRoomId,
        setHasPaused,
        resetGame,
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
        setControllerSocket,
        setPlayerNumber,
        setPlayerFinished,
        setObstacle,
        setPlayerRank,
        setGameStarted,
        setName,
        setAvailableCharacters,
        history,
        resetGame,
        setHasPaused,
        setUserId,
        setReady,
        setPlayerDead,
        setConnectedUsers,
        setEarlySolvableObstacle,
        playerRank,
        setExceededChaserPushes,
        setStunnablePlayers,
        setChosenGame,
        setPhotos,
        setVoteForPhotoMessage,
        setRoundIdx,
        setCountdownTime,
        setTopicMessage,
    };

    const content = {
        controllerSocket,
        setControllerSocket: (val: Socket, roomId: string) =>
            handleSetSocket(val, roomId, playerFinished, {
                ...dependencies,
            }),
        handleSocketConnection: (roomId: string, name: string) => {
            handleSocketConnection(roomId, name, playerFinished, {
                ...dependencies,
                setRoomId,
            });
        },
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
