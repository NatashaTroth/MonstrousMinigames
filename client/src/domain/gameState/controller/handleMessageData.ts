import { History } from 'history';

import {
    IGameFinished,
    IObstacleMessage,
    MessageData,
    UserInitMessage,
} from '../../../contexts/ControllerSocketContextProvider';
import { IObstacle } from '../../../contexts/PlayerContextProvider';
import { MessageTypes } from '../../../utils/constants';
import { Socket } from '../../socket/Socket';
import { localStorage } from '../../storage/LocalStorage';
import { sessionStorage } from '../../storage/SessionStorage';
import { persistUser } from '../../user/persistUser';
import { playerHasFinished } from '../../user/playerHasFinished';
import { gameHasStarted } from './gameHasStarted';
import { gameHasTimedOut } from './gameHasTimedOut';
import { handleResetGame } from './handleResetGame';

export interface HandleMessageDataDependencies {
    setPlayerAdmin: (val: boolean) => void;
    setPlayerNumber: (val: number) => void;
    setPlayerFinished: (val: boolean) => void;
    setObstacle: (roomId: string | undefined, obstacle: undefined | IObstacle) => void;
    setPlayerRank: (val: number) => void;
    setGameStarted: (val: boolean) => void;
    setHasPaused: (val: boolean) => void;
    resetGame: () => void;
    resetPlayer: () => void;
    history: History;
}
interface HandleMessageDataProps {
    data: MessageData;
    playerFinished: boolean;
    roomId: string;
    socket: Socket;
    dependencies: HandleMessageDataDependencies;
}
export function handleMessageData(props: HandleMessageDataProps) {
    let messageData;
    const { data, dependencies, playerFinished, roomId, socket } = props;
    const {
        setPlayerAdmin,
        setPlayerNumber,
        setPlayerFinished,
        setObstacle,
        setPlayerRank,
        setGameStarted,
        setHasPaused,
        resetPlayer,
        resetGame,
        history,
    } = dependencies;

    switch (data.type) {
        case MessageTypes.userInit:
            persistUser(data as UserInitMessage, {
                setPlayerAdmin,
                setPlayerNumber,
                sessionStorage,
                localStorage,
            });
            break;
        case MessageTypes.obstacle:
            messageData = data as IObstacleMessage;
            setObstacle(roomId, { type: messageData.obstacleType, id: messageData.obstacleId });
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
        case MessageTypes.gameHasPaused:
            setHasPaused(true);
            break;
        case MessageTypes.gameHasResumed:
            setHasPaused(false);
            break;
        case MessageTypes.gameHasStopped:
            handleResetGame(socket, { resetPlayer, resetGame });
            history.push(`/controller/${roomId}/lobby`);
            break;
    }
}
