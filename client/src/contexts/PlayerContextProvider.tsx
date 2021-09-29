import * as React from 'react';

import { Character } from '../config/characters';
import { ObstacleTypes, TrashType } from '../utils/constants';

export const defaultValue = {
    playerRank: undefined,
    setPlayerRank: () => {
        // do nothing
    },
    playerNumber: undefined,
    setPlayerNumber: () => {
        // do nothing
    },
    character: undefined,
    setCharacter: () => {
        // do nothing
    },
    name: '',
    setName: () => {
        // do nothing
    },
    ready: false,
    setReady: () => {
        // do nothing
    },
    userId: '',
    setUserId: () => {
        // do nothing
    },
};
export interface Obstacle {
    type: ObstacleTypes;
    id: number;
    numberTrashItems?: number;
    trashType?: TrashType;
    distance?: number;
}

interface PlayerContextProps {
    playerRank: number | undefined;
    setPlayerRank: (val: number) => void;
    playerNumber: number | undefined;
    setPlayerNumber: (val: number) => void;
    character: undefined | Character;
    setCharacter: (val: Character) => void;
    name: string;
    setName: (val: string) => void;
    ready: boolean;
    setReady: (val: boolean) => void;
    userId: string;
    setUserId: (val: string) => void;
}

export const PlayerContext = React.createContext<PlayerContextProps>(defaultValue);

const PlayerContextProvider: React.FunctionComponent = ({ children }) => {
    const [userId, setUserId] = React.useState<string>('');
    const [playerRank, setPlayerRank] = React.useState<undefined | number>();
    const [playerNumber, setPlayerNumber] = React.useState<number | undefined>();
    const [character, setCharacter] = React.useState<undefined | Character>(undefined);
    const [name, setName] = React.useState<string>('');
    const [ready, setReady] = React.useState<boolean>(false);

    const content = {
        playerRank,
        setPlayerRank,
        //TODO
        // resetPlayer: () => {
        //     setPlayerFinished(false);
        //     setPlayerRank(undefined);
        // },
        playerNumber,
        setPlayerNumber,
        character,
        setCharacter,
        name,
        setName,
        ready,
        setReady,
        userId,
        setUserId,
    };
    return <PlayerContext.Provider value={content}>{children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
