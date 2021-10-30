import * as React from 'react';

import { defaultAvailableCharacters } from '../config/characters';
import { GameNames } from '../config/games';
import { ScreenStates } from '../config/screenStates';
import { handleSetGameFinished } from '../domain/commonGameState/controller/handleSetGameFinished';
import { handleSetGameStarted } from '../domain/commonGameState/controller/handleSetGameStarted';
import { User } from '../domain/typeGuards/connectedUsers';
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
    hasPaused: false,
    setHasPaused: () => {
        // do nothing
    },
    chosenGame: undefined,
    setChosenGame: () => {
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
    screenState: ScreenStates.lobby,
    setScreenState: () => {
        // do nothing
    },
    availableCharacters: [],
    setAvailableCharacters: () => {
        // do nothing
    },
};
interface GameContextProps {
    finished: boolean;
    setFinished: (val: boolean) => void;
    gameStarted: boolean;
    setGameStarted: (val: boolean) => void;
    roomId?: string;
    setRoomId: (val?: string) => void;
    connectedUsers?: User[];
    setConnectedUsers: (val: User[]) => void;
    resetGame: () => void;
    showInstructions: boolean;
    setShowInstructions: (val: boolean) => void;
    countdownTime: number;
    setCountdownTime: (val: number) => void;
    playerRanks?: PlayerRank[];
    setPlayerRanks: (val: PlayerRank[]) => void;
    hasPaused: boolean;
    setHasPaused: (val: boolean) => void;
    chosenGame: undefined | GameNames;
    setChosenGame: (val: undefined | GameNames) => void;
    tutorial: boolean;
    setTutorial: (val: boolean) => void;
    screenAdmin: boolean;
    setScreenAdmin: (val: boolean) => void;
    screenState: string;
    setScreenState: (val: string) => void;
    availableCharacters: number[];
    setAvailableCharacters: (val: number[]) => void;
}

export const GameContext = React.createContext<GameContextProps>(defaultValue);

const GameContextProvider: React.FunctionComponent = ({ children }) => {
    const [playerRanks, setPlayerRanks] = React.useState<undefined | PlayerRank[]>();
    const [finished, setFinished] = React.useState<boolean>(false);
    const [gameStarted, setGameStarted] = React.useState<boolean>(false);
    const [roomId, setRoomId] = React.useState<undefined | string>();
    const [connectedUsers, setConnectedUsers] = React.useState<undefined | User[]>();
    const [showInstructions, setShowInstructions] = React.useState<boolean>(true);
    const [countdownTime, setCountdownTime] = React.useState<number>(0);
    const [hasPaused, setHasPaused] = React.useState<boolean>(false);
    // TODO use data from socket
    const [chosenGame, setChosenGame] = React.useState<undefined | GameNames>();
    const [tutorial, setTutorial] = React.useState(true);
    const [screenAdmin, setScreenAdmin] = React.useState<boolean>(false);
    const [screenState, setScreenState] = React.useState<string>(ScreenStates.lobby);
    const [availableCharacters, setAvailableCharacters] = React.useState<number[]>(defaultAvailableCharacters);

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
        hasPaused,
        setHasPaused,
        chosenGame,
        setChosenGame,
        tutorial,
        setTutorial,
        screenAdmin,
        setScreenAdmin,
        screenState,
        setScreenState,
        availableCharacters,
        setAvailableCharacters,
    };
    return <GameContext.Provider value={content}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
