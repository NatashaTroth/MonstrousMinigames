import { handleMessageData, HandleMessageDataDependencies } from './handleMessageData';
import history from './history';
import { Socket } from './socket/Socket';

interface HandleControllerSocketDependencies extends HandleMessageDataDependencies {
    setControllerSocket: (socket: Socket) => void;
    setPlayerAdmin: (val: boolean) => void;
}

export function handleSetControllerSocket(
    socket: Socket,
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

    // TOTO remove any
    socket.listen((data: any) => {
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
        });
    });
    history.push(`/controller/${roomId}/lobby`);
}
