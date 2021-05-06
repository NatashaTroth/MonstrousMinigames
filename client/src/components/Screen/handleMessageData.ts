import { IPlayerState } from '../../contexts/GameContextProvider';
import { IPlayerRank } from '../../contexts/ScreenSocketContextProvider';
import { GameState, MessageTypes } from '../../utils/constants';
import history from '../../utils/history';

export type MessageData = IGameState | IConnectedUsers | undefined;

interface HandleMessageData {
    messageData: MessageData;
    roomId: string | undefined;
    dependencies: {
        setHasPaused: (val: boolean) => void;
        handleGameState: (data: IGameState) => void;
        handleGameHasFinished: (data: IGameState) => void;
        setGameStarted: (val: boolean) => void;
        setCountdownTime: (val: number) => void;
        setConnectedUsers: (users: IUser[]) => void;
        setHasTimedOut: (val: boolean) => void;
    };
}

interface IGameState {
    data?: IGameStateData;
    type: string;
}

export interface IUser {
    id: string;
    name: string;
    roomId: string;
    number: number;
}

interface IGameStarted {
    type: string;
    countdownTime: number;
}

interface IConnectedUsers {
    type: string;
    users?: IUser[];
}

interface IGameStateData {
    gameState: GameState;
    numberOfObstacles: number;
    roomId: string;
    trackLength: number;
    playersState?: IPlayerState[];
    playerRanks?: IPlayerRank[];
}

export function handleMessageData(props: HandleMessageData) {
    const { messageData, dependencies, roomId } = props;

    const {
        setHasPaused,
        handleGameState,
        handleGameHasFinished,
        setGameStarted,
        setCountdownTime,
        setConnectedUsers,
        setHasTimedOut,
    } = dependencies;
    let data;

    switch (messageData?.type) {
        case MessageTypes.gameState:
            handleGameState(messageData as IGameState);
            break;
        case MessageTypes.connectedUsers:
            data = messageData as IConnectedUsers;
            if (data.users) {
                setConnectedUsers(data.users);
            }
            break;
        case MessageTypes.started:
            data = messageData as IGameStarted;
            setCountdownTime(data.countdownTime);
            setGameStarted(true);
            history.push(`/screen/${roomId}/game1`);
            break;
        case MessageTypes.gameHasFinished:
            handleGameHasFinished(messageData as IGameState);
            break;
        case MessageTypes.gameHasReset:
            history.push(`/screen/${roomId}/lobby`);
            break;
        case MessageTypes.gameHasPaused:
            setHasPaused(true);
            break;
        case MessageTypes.gameHasResumed:
            setHasPaused(false);
            break;
        case MessageTypes.gameHasTimedOut:
            setHasTimedOut(true);
            handleGameHasFinished(messageData as IGameState);
            break;
        case MessageTypes.gameHasStopped:
            history.push(`/screen/${roomId}/lobby`);
            break;
    }
}
