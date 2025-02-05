import * as React from 'react';

import history from '../../domain/history/history';
import { ObstacleTypes, TrashType } from '../../utils/constants';
import { controllerGame1Route, controllerObstacleRoute } from '../../utils/routes';

export const defaultValue = {
    obstacle: undefined,
    setObstacle: () => {
        // do nothing
    },
    playerFinished: false,
    setPlayerFinished: () => {
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
    earlySolvableObstacle: undefined,
    setEarlySolvableObstacle: () => {
        // do nothing
    },
    exceededChaserPushes: false,
    setExceededChaserPushes: () => {
        // do nothing
    },
    stunnablePlayers: [],
    setStunnablePlayers: () => {
        // do nothing
    },
    resetGame1: () => {
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

interface Game1ContextProps {
    obstacle: undefined | Obstacle;
    setObstacle: (roomId: string | undefined, val: Obstacle | undefined) => void;
    playerFinished: boolean;
    setPlayerFinished: (val: boolean) => void;
    dead: boolean;
    setPlayerDead: (val: boolean) => void;
    hasStone: boolean;
    setHasStone: (val: boolean) => void;
    earlySolvableObstacle: Obstacle | undefined;
    setEarlySolvableObstacle: (val: Obstacle | undefined) => void;
    exceededChaserPushes: boolean;
    setExceededChaserPushes: (val: boolean) => void;
    stunnablePlayers: string[];
    setStunnablePlayers: (val: string[]) => void;
    resetGame1: () => void;
}

export const Game1Context = React.createContext<Game1ContextProps>(defaultValue);

let obstacleHelper: undefined | Obstacle = undefined;

const Game1ContextProvider: React.FunctionComponent = ({ children }) => {
    const [obstacle, setObstacle] = React.useState<undefined | Obstacle>();
    const [playerFinished, setPlayerFinished] = React.useState<boolean>(defaultValue.playerFinished);
    const [dead, setPlayerDead] = React.useState(defaultValue.dead);
    const [hasStone, setHasStone] = React.useState(defaultValue.hasStone);
    const [earlySolvableObstacle, setEarlySolvableObstacle] = React.useState<Obstacle | undefined>();
    const [exceededChaserPushes, setExceededChaserPushes] = React.useState(defaultValue.exceededChaserPushes);
    const [stunnablePlayers, setStunnablePlayers] = React.useState<string[]>([]);

    const content = {
        obstacle,
        setObstacle: (roomId: string | undefined, val: undefined | Obstacle) => {
            if (val && obstacleHelper?.id !== val?.id) {
                setObstacle(val);
                obstacleHelper = val;
                history.push(controllerObstacleRoute(roomId, val.type)!);
            } else if (!val && obstacleHelper) {
                setObstacle(val);
                obstacleHelper = val;
                history.push(controllerGame1Route(roomId));
            }
        },
        dead,
        setPlayerDead,
        hasStone,
        setHasStone,
        earlySolvableObstacle,
        setEarlySolvableObstacle,
        exceededChaserPushes,
        setExceededChaserPushes,
        playerFinished,
        setPlayerFinished,
        stunnablePlayers,
        setStunnablePlayers,
        resetGame1: () => {
            setObstacle(defaultValue.obstacle);
            setPlayerFinished(defaultValue.playerFinished);
            setPlayerDead(defaultValue.dead);
            setHasStone(defaultValue.hasStone);
            setEarlySolvableObstacle(defaultValue.earlySolvableObstacle);
            setExceededChaserPushes(defaultValue.exceededChaserPushes);
            setStunnablePlayers([]);
        },
    };
    return <Game1Context.Provider value={content}>{children}</Game1Context.Provider>;
};

export default Game1ContextProvider;
