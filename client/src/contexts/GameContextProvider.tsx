import * as React from 'react';

import { resetObstacle } from '../components/Controller/Obstacles/TreeTrunk';
import { OBSTACLES } from '../utils/constants';
import { IUser } from './ControllerSocketContextProvider';
import { IPlayerRank } from './ScreenSocketContextProvider';

export const defaultValue = {
    trackLength: undefined,
    setTrackLength: () => {
        // do nothing
    },
    players: undefined,
    setPlayers: () => {
        // do nothing
    },
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
};
interface IGameContext {
    trackLength?: number;
    setTrackLength: (val: number) => void;
    players?: IPlayerState[];
    setPlayers: (val: IPlayerState[]) => void;
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
}

interface IObstacle {
    positionX: number;
    type: OBSTACLES;
}

export interface IPlayerState {
    atObstacle: boolean;
    finished: boolean;
    id: string;
    name: string;
    obstacles: IObstacle[];
    positionX: number;
    rank: number;
    number: number;
}

export const GameContext = React.createContext<IGameContext>(defaultValue);

const GameContextProvider: React.FunctionComponent = ({ children }) => {
    const [trackLength, setTrackLength] = React.useState<undefined | number>();
    const [players, setPlayers] = React.useState<undefined | IPlayerState[]>();
    const [playerRanks, setPlayerRanks] = React.useState<undefined | IPlayerRank[]>();
    const [finished, setFinished] = React.useState<boolean>(false);
    const [gameStarted, setGameStarted] = React.useState<boolean>(false);
    const [roomId, setRoomId] = React.useState<undefined | string>();
    const [connectedUsers, setConnectedUsers] = React.useState<undefined | IUser[]>();
    const [showInstructions, setShowInstructions] = React.useState<boolean>(true);
    const [countdownTime, setCountdownTime] = React.useState<number>(0);
    const [hasTimedOut, setHasTimedOut] = React.useState<boolean>(false);

    const content = {
        trackLength,
        setTrackLength,
        players,
        setPlayers,
        finished,
        setFinished: (val: boolean) => {
            document.body.style.overflow = 'visible';
            document.body.style.position = 'static';
            document.body.style.userSelect = 'auto';

            setFinished(val);
        },
        gameStarted,
        setGameStarted: (val: boolean) => {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.userSelect = 'none';

            setGameStarted(val);
        },
        roomId,
        setRoomId,
        connectedUsers,
        setConnectedUsers,
        resetGame: () => {
            setTrackLength(undefined);
            setFinished(false);
            setGameStarted(false);
            setPlayers(undefined);
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
    };
    return <GameContext.Provider value={content}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
