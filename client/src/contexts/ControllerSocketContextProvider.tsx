import * as React from 'react';

import { handleSetSocket } from '../domain/controller/socket/handleSetSocket';
import { handleSocketConnection } from '../domain/controller/socket/handleSocketConnection';
import history from '../domain/history/history';
import { InMemorySocketFake } from '../domain/socket/InMemorySocketFake';
import { Socket } from '../domain/socket/Socket';
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

const ControllerSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [controllerSocket, setControllerSocket] = React.useState<Socket>(new InMemorySocketFake());
    const {
        setObstacle,
        setPlayerFinished,
        setPlayerRank,
        setPlayerNumber,
        setPermissionGranted,
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
    } = React.useContext(GameContext);

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
                setPermissionGranted,
                setRoomId,
            });
        },
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
