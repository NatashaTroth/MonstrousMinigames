import { handleMessageData, HandleMessageDataDependencies } from '../gameState/handleMessageData';
import history from '../history/history';
import { Socket } from './Socket';

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

    // TOTO remove any and use typeGuard and M
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
                history,
            },
        });
    });

    if (socket) {
        history.push(`/controller/${roomId}/lobby`);
    }
}
