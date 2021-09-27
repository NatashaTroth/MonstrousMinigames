import * as React from 'react';
import { useHistory } from 'react-router';

import { Character } from '../config/characters';
import { ObstacleTypes, TrashType } from '../utils/constants';
import { controllerGame1Route, controllerObstacleRoute } from '../utils/routes';

export const defaultValue = {
    obstacle: undefined,
    setObstacle: () => {
        // do nothing
    },
    playerFinished: false,
    setPlayerFinished: () => {
        // do nothing
    },
    playerRank: undefined,
    setPlayerRank: () => {
        // do nothing
    },
    resetPlayer: () => {
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
    dead: false,
    setPlayerDead: () => {
        // do nothing
    },
    hasStone: false,
    setHasStone: () => {
        // do nothing
    },
    exceededChaserPushes: false,
    setExceededChaserPushes: () => {
        // do nothing
    },
};
export interface Obstacle {
    type: ObstacleTypes;
    id: number;
    skippable: boolean;
    numberTrashItems?: number;
    trashType?: TrashType;
}
interface PlayerContextProps {
    obstacle: undefined | Obstacle;
    setObstacle: (roomId: string | undefined, val: Obstacle | undefined) => void;
    playerFinished: boolean;
    setPlayerFinished: (val: boolean) => void;
    playerRank: number | undefined;
    setPlayerRank: (val: number) => void;
    resetPlayer: () => void;
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
    dead: boolean;
    setPlayerDead: (val: boolean) => void;
    hasStone: boolean;
    setHasStone: (val: boolean) => void;
    exceededChaserPushes: boolean;
    setExceededChaserPushes: (val: boolean) => void;
}

export const PlayerContext = React.createContext<PlayerContextProps>(defaultValue);

const PlayerContextProvider: React.FunctionComponent = ({ children }) => {
    const [userId, setUserId] = React.useState<string>('');
    const [obstacle, setObstacle] = React.useState<undefined | Obstacle>();
    const [playerFinished, setPlayerFinished] = React.useState<boolean>(false);
    const [playerRank, setPlayerRank] = React.useState<undefined | number>();
    const [playerNumber, setPlayerNumber] = React.useState<number | undefined>();
    const history = useHistory();
    const [character, setCharacter] = React.useState<undefined | Character>(undefined);
    const [name, setName] = React.useState<string>('');
    const [ready, setReady] = React.useState<boolean>(false);
    const [dead, setPlayerDead] = React.useState(false);
    const [hasStone, setHasStone] = React.useState(false);
    const [exceededChaserPushes, setExceededChaserPushes] = React.useState(false);

    let reroute = true;

    const content = {
        obstacle,
        setObstacle: (roomId: string | undefined, val: undefined | Obstacle) => {
            setObstacle(val);
            if (val) {
                reroute = true;
                history.push(controllerObstacleRoute(roomId, val.type)!);
            } else if (reroute) {
                reroute = false;
                history.push(controllerGame1Route(roomId));
            }
        },
        playerFinished,
        setPlayerFinished,
        playerRank,
        setPlayerRank,
        resetPlayer: () => {
            setPlayerFinished(false);
            setPlayerRank(undefined);
        },
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
        dead,
        setPlayerDead,
        hasStone,
        setHasStone,
        exceededChaserPushes,
        setExceededChaserPushes,
    };
    return <PlayerContext.Provider value={content}>{children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
