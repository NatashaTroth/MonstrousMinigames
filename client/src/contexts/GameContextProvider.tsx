import * as React from 'react';

import { handleSetGameFinished } from '../domain/gameState/controller/handleSetGameFinished';
import { handleSetGameStarted } from '../domain/gameState/controller/handleSetGameStarted';
import { IUser } from './ControllerSocketContextProvider';
import { PlayerRank } from './ScreenSocketContextProvider';

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
    gameChosen: false,
    setGameChosen: () => {
        // do nothing
    },
    tutorial: false,
    setTutorial: () => {
        // do nothing
    },
    screenAdmin: false,
    setScreenAdmin: () => {
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
    playerRanks?: PlayerRank[];
    setPlayerRanks: (val: PlayerRank[]) => void;
    hasTimedOut: boolean;
    setHasTimedOut: (val: boolean) => void;
    hasPaused: boolean;
    setHasPaused: (val: boolean) => void;
    gameChosen: boolean;
    setGameChosen: (val: boolean) => void;
    tutorial: boolean;
    setTutorial: (val: boolean) => void;
    screenAdmin: boolean;
    setScreenAdmin: (val: boolean) => void;
}

export const GameContext = React.createContext<IGameContext>(defaultValue);

const GameContextProvider: React.FunctionComponent = ({ children }) => {
    const [playerRanks, setPlayerRanks] = React.useState<undefined | PlayerRank[]>();
    const [finished, setFinished] = React.useState<boolean>(false);
    const [gameStarted, setGameStarted] = React.useState<boolean>(false);
    const [roomId, setRoomId] = React.useState<undefined | string>();
    const [connectedUsers, setConnectedUsers] = React.useState<undefined | IUser[]>();
    const [showInstructions, setShowInstructions] = React.useState<boolean>(true);
    const [countdownTime, setCountdownTime] = React.useState<number>(0);
    const [hasTimedOut, setHasTimedOut] = React.useState<boolean>(false);
    const [hasPaused, setHasPaused] = React.useState<boolean>(false);
    // TODO use data from socket
    const [gameChosen, setGameChosen] = React.useState(false);
    const [tutorial, setTutorial] = React.useState(true);
    const [screenAdmin, setScreenAdmin] = React.useState<boolean>(false);

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
        gameChosen,
        setGameChosen,
        tutorial,
        setTutorial,
        screenAdmin,
        setScreenAdmin,
    };
    return <GameContext.Provider value={content}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
