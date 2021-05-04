import { MessageData } from '../contexts/ControllerSocketContextProvider';
import { handleMessageData, HandleMessageDataDependencies } from './handleMessageData';
import history from './history';

interface HandleControllerSocketDependencies extends HandleMessageDataDependencies {
    setControllerSocket: (socker: SocketIOClient.Socket | undefined) => void;
    setPlayerAdmin: (val: boolean) => void;
}

export function handleSetControllerSocket(
    socket: SocketIOClient.Socket | undefined,
    roomId: string,
    playerFinished: boolean,
    dependencies: HandleControllerSocketDependencies
) {
    const {
        setControllerSocket,
        setPlayerNumber,
        setPlayerFinished,
        setObstacle,
        setPlayerRank,
        setGameStarted,
        setPlayerAdmin,
        setHasPaused,
        resetGame,
        resetPlayer,
    } = dependencies;

    setControllerSocket(socket);

    if (socket) {
        socket.on('message', (data: MessageData) =>
            handleMessageData({
                data,
                playerFinished,
                roomId,
                socket,
                dependencies: {
                    setPlayerAdmin,
                    setPlayerNumber,
                    setPlayerFinished,
                    setObstacle,
                    setPlayerRank,
                    setGameStarted,
                    setHasPaused,
                    resetGame,
                    resetPlayer,
                },
            })
        );
        history.push(`/controller/${roomId}/lobby`);
    }
}
