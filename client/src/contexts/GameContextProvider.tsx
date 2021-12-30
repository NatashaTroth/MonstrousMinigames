import * as React from 'react';

import { defaultAvailableCharacters } from '../config/characters';
import { GameNames } from '../config/games';
import { ScreenStates } from '../config/screenStates';
import { User } from '../domain/typeGuards/connectedUsers';
import { PlayerRank } from './screen/ScreenSocketContextProvider';

export enum GameType {
    GameOne = 'The Great Monster Escape',
    GameTwo = 'Kill sheep',
    GameThree = 'Snapshot Marathon',
}

export interface UserPoints {
    userId: string;
    name: string;
    points: number;
    rank: number;
}
export interface GamePlayed {
    game: GameType;
    playerRanks: PlayerRank[];
}

export interface LeaderboardState {
    gameHistory: GamePlayed[];
    userPoints: UserPoints[]; //sorted by points
}

export const defaultValue = {
    finished: false,
    setFinished: () => {
        // do nothing
    },
    gameStarted: false,
    setGameStarted: () => {
        // do nothing
    },
    sheepGameStarted: false,
    setSheepGameStarted: () => {
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
    leaderboardState: undefined,
    setLeaderboardState: () => {
        // do nothing
    },
    tutorial: true,
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
    sheepGameStarted: boolean;
    setSheepGameStarted: (val: boolean) => void;
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
    leaderboardState: undefined | LeaderboardState;
    setLeaderboardState: (val: undefined | LeaderboardState) => void;
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
    const [finished, setFinished] = React.useState<boolean>(defaultValue.finished);
    const [gameStarted, setGameStarted] = React.useState<boolean>(defaultValue.gameStarted);
    const [sheepGameStarted, setSheepGameStarted] = React.useState<boolean>(defaultValue.sheepGameStarted);
    const [roomId, setRoomId] = React.useState<undefined | string>();
    const [connectedUsers, setConnectedUsers] = React.useState<undefined | User[]>();
    const [showInstructions, setShowInstructions] = React.useState<boolean>(defaultValue.showInstructions);
    const [countdownTime, setCountdownTime] = React.useState<number>(defaultValue.countdownTime);
    const [hasPaused, setHasPaused] = React.useState<boolean>(defaultValue.hasPaused);
    const [chosenGame, setChosenGame] = React.useState<undefined | GameNames>();
    const [leaderboardState, setLeaderboardState] = React.useState<undefined | LeaderboardState>();
    const [tutorial, setTutorial] = React.useState(defaultValue.tutorial);
    const [screenAdmin, setScreenAdmin] = React.useState<boolean>(defaultValue.screenAdmin);
    const [screenState, setScreenState] = React.useState<string>(ScreenStates.lobby);
    const [availableCharacters, setAvailableCharacters] = React.useState<number[]>(defaultAvailableCharacters);

    const content = {
        finished,
        setFinished: (val: boolean) => {
            document.body.style.overflow = 'visible';
            document.body.style.position = 'static';
            document.body.style.userSelect = 'auto';

            setFinished(val);
        },
        gameStarted,
        setGameStarted,
        sheepGameStarted,
        setSheepGameStarted,
        roomId,
        setRoomId,
        connectedUsers,
        setConnectedUsers,
        resetGame: () => {
            setPlayerRanks(defaultValue.playerRanks);
            setFinished(defaultValue.finished);
            setGameStarted(defaultValue.gameStarted);
            setSheepGameStarted(defaultValue.sheepGameStarted);
            setShowInstructions(defaultValue.showInstructions);
            setHasPaused(defaultValue.hasPaused);
            setTutorial(defaultValue.tutorial);
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
        leaderboardState,
        setLeaderboardState,
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
