import * as React from 'react';

import { resetObstacle } from '../components/Controller/Obstacles/TreeTrunk';
import { handleSetGameFinished } from '../utils/gameState/handleSetGameFinished';
import { handleSetGameStarted } from '../utils/gameState/handleSetGameStarted';
import { IUser } from './ControllerSocketContextProvider';
import { IPlayerRank } from './ScreenSocketContextProvider';

export const defaultValue = {
    finished: false,
    setFinished: () => {
        // do nothing
    },
    gameStarted: false,
    setGameStarted: () => {
        // do nothing
    },
    roomId: undefined,
    setRoomId: () => {
        // do nothing
    },
    connectedUsers: undefined,
    setConnectedUsers: () => {
        // do nothing
    },
    resetGame: () => {
        // do nothing
    },
    showInstructions: true,
    setShowInstructions: () => {
        // do nothing
    },
    countdownTime: 0,
    setCountdownTime: () => {
        // do nothing
    },
    playerRanks: undefined,
    setPlayerRanks: () => {
        // do nothing
    },
    hasTimedOut: false,
    setHasTimedOut: () => {
        // do nothing
    },
    hasPaused: false,
    setHasPaused: () => {
        // do nothing
    },
};
interface IGameContext {
    finished: boolean;
    setFinished: (val: boolean) => void;
    gameStarted: boolean;
    setGameStarted: (val: boolean) => void;
    roomId?: string;
    setRoomId: (val?: string) => void;
    connectedUsers?: IUser[];
    setConnectedUsers: (val: IUser[]) => void;
    resetGame: () => void;
    showInstructions: boolean;
    setShowInstructions: (val: boolean) => void;
    countdownTime: number;
    setCountdownTime: (val: number) => void;
    playerRanks?: IPlayerRank[];
    setPlayerRanks: (val: IPlayerRank[]) => void;
    hasTimedOut: boolean;
    setHasTimedOut: (val: boolean) => void;
    hasPaused: boolean;
    setHasPaused: (val: boolean) => void;
}

export const GameContext = React.createContext<IGameContext>(defaultValue);

const GameContextProvider: React.FunctionComponent = ({ children }) => {
    const [playerRanks, setPlayerRanks] = React.useState<undefined | IPlayerRank[]>();
    const [finished, setFinished] = React.useState<boolean>(false);
    const [gameStarted, setGameStarted] = React.useState<boolean>(false);
    const [roomId, setRoomId] = React.useState<undefined | string>();
    const [connectedUsers, setConnectedUsers] = React.useState<undefined | IUser[]>();
    const [showInstructions, setShowInstructions] = React.useState<boolean>(true);
    const [countdownTime, setCountdownTime] = React.useState<number>(0);
    const [hasTimedOut, setHasTimedOut] = React.useState<boolean>(false);
    const [hasPaused, setHasPaused] = React.useState<boolean>(false);

    const content = {
        finished,
        setFinished: (val: boolean) => handleSetGameFinished(val, { setFinished }),
        gameStarted,
        setGameStarted: (val: boolean) => handleSetGameStarted(val, { setGameStarted }),
        roomId,
        setRoomId,
        connectedUsers,
        setConnectedUsers,
        resetGame: () => {
            setFinished(false);
            setGameStarted(false);
            resetObstacle();
        },
        showInstructions,
        setShowInstructions,
        countdownTime,
        setCountdownTime,
        playerRanks,
        setPlayerRanks,
        hasTimedOut,
        setHasTimedOut,
        hasPaused,
        setHasPaused,
    };
    return <GameContext.Provider value={content}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
