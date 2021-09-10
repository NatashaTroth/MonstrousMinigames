import * as React from 'react';

import { handleSetSocket } from '../domain/controller/socket/handleSetSocket';
import { handleSocketConnection } from '../domain/controller/socket/handleSocketConnection';
import history from '../domain/history/history';
import { InMemorySocketFake } from '../domain/socket/InMemorySocketFake';
import { Socket } from '../domain/socket/Socket';
import addMovementListener from '../domain/user/addMovementListener';
import { window } from '../domain/window/WindowAdapter';
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
        setPlayerRank,
        setPlayerNumber,
        playerFinished,
        resetPlayer,
        setName,
        setUserId,
        setPlayerDead,
        playerRank,
    } = React.useContext(PlayerContext);

    const {
        setGameStarted,
        setRoomId,
        setHasPaused,
        resetGame,
        setAvailableCharacters,
        setConnectedUsers,
        hasPaused,
    } = React.useContext(GameContext);

    React.useEffect(() => {
        if (permission) {
            addMovementListener(controllerSocket, hasPaused, playerFinished, window);
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
        resetPlayer,
        setHasPaused,
        setUserId,
        setPlayerDead,
        setConnectedUsers,
        playerRank,
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
