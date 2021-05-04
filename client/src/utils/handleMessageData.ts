import {
    IGameFinished,
    IObstacleMessage,
    IUserInitMessage,
    MessageData,
} from '../contexts/ControllerSocketContextProvider';
import { IObstacle } from '../contexts/PlayerContextProvider';
import { MessageTypes } from './constants';
import { gameHasStarted } from './gameHasStarted';
import { gameHasTimedOut } from './gameHasTimedOut';
import history from './history';
import { persistUser } from './persistUser';
import { playerHasFinished } from './playerHasFinished';

interface HandleMessageDataProps {
    data: MessageData;
    playerFinished: boolean;
    roomId: string | undefined;
    dependencies: {
        setPlayerAdmin: (val: boolean) => void;
        setPlayerNumber: (val: number) => void;
        setPlayerFinished: (val: boolean) => void;
        setObstacle: (obstacle: undefined | IObstacle) => void;
        setPlayerRank: (val: number) => void;
        setGameStarted: (val: boolean) => void;
    };
}
export function handleMessageData(props: HandleMessageDataProps) {
    let messageData;
    const { data, dependencies, playerFinished, roomId } = props;
    const {
        setPlayerAdmin,
        setPlayerNumber,
        setPlayerFinished,
        setObstacle,
        setPlayerRank,
        setGameStarted,
    } = dependencies;

    switch (data.type) {
        case MessageTypes.userInit:
            persistUser(data as IUserInitMessage, { setPlayerAdmin, setPlayerNumber });
            break;
        case MessageTypes.obstacle:
            messageData = data as IObstacleMessage;
            setObstacle({ type: messageData.obstacleType, id: messageData.obstacleId });
            break;
        case MessageTypes.playerFinished:
            playerHasFinished(data as IGameFinished, playerFinished, { setPlayerFinished, setPlayerRank });
            break;
        case MessageTypes.started:
            gameHasStarted(roomId, { setGameStarted });
            break;
        case MessageTypes.gameHasReset:
            history.push(`/controller/${roomId}/lobby`);
            break;
        case MessageTypes.gameHasTimedOut:
            gameHasTimedOut(data as IGameFinished, { setPlayerFinished, setPlayerRank });
            break;
    }
}
