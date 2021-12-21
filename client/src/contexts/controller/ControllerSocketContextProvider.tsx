import * as React from 'react';

import history from '../../domain/history/history';
import { FakeInMemorySocket } from '../../domain/socket/InMemorySocketFake';
import { Socket } from '../../domain/socket/Socket';
import { SocketIOAdapter } from '../../domain/socket/SocketIOAdapter';
import { controllerChooseCharacterRoute } from '../../utils/routes';
import { GameContext } from '../GameContextProvider';
import { useGame1Handler } from './useGame1Handler';
import { useGame2Handler } from './useGame2Handler';
import { useGame3Handler } from './useGame3Handler';
import { useGameHandler } from './useGameHandler';

export const defaultValue = {
    controllerSocket: new FakeInMemorySocket(),
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
    const { setRoomId } = React.useContext(GameContext);

    const [controllerSocket, setControllerSocket] = React.useState<Socket>(new FakeInMemorySocket());

    useGameHandler(controllerSocket);
    useGame1Handler(controllerSocket, permission);
    useGame2Handler(controllerSocket);
    useGame3Handler(controllerSocket);

    const content = {
        controllerSocket,
        handleSocketConnection: (roomId: string, name: string) => {
            setRoomId(roomId);

            const socket = new SocketIOAdapter(roomId, 'controller', name);

            if (socket) {
                setControllerSocket(socket);
            }
            history.push(controllerChooseCharacterRoute(roomId));
        },
    };
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>;
};

export default ControllerSocketContextProvider;
