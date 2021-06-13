import * as React from 'react';
import { useHistory } from 'react-router';

import { Obstacles } from '../utils/constants';
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
    isPlayerAdmin: false,
    setIsPlayerAdmin: () => {
        // do nothing
    },
    permission: false,
    setPermissionGranted: () => {
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
    stoneTimeout: undefined,
    setStoneTimeout: () => {
        // do nothing
    },
};
export interface IObstacle {
    type: Obstacles;
    id: number;
}
interface IPlayerContext {
    obstacle: undefined | IObstacle;
    setObstacle: (roomId: string | undefined, val: IObstacle | undefined) => void;
    playerFinished: boolean;
    setPlayerFinished: (val: boolean) => void;
    playerRank: number | undefined;
    setPlayerRank: (val: number) => void;
    isPlayerAdmin: boolean;
    setIsPlayerAdmin: (val: boolean) => void;
    permission: boolean;
    setPermissionGranted: (val: boolean) => void;
    resetPlayer: () => void;
    playerNumber: number | undefined;
    setPlayerNumber: (val: number) => void;
    character: undefined | string;
    setCharacter: (val: string) => void;
    name: string;
    setName: (val: string) => void;
    ready: boolean;
    setReady: (val: boolean) => void;
    userId: string;
    setUserId: (val: string) => void;
    dead: boolean;
    setPlayerDead: (val: boolean) => void;
    stoneTimeout: ReturnType<typeof setTimeout> | undefined;
    setStoneTimeout: (val: ReturnType<typeof setTimeout>) => void;
}

export const PlayerContext = React.createContext<IPlayerContext>(defaultValue);

const PlayerContextProvider: React.FunctionComponent = ({ children }) => {
    const [userId, setUserId] = React.useState<string>('');
    const [obstacle, setObstacle] = React.useState<undefined | IObstacle>();
    const [playerFinished, setPlayerFinished] = React.useState<boolean>(false);
    const [playerRank, setPlayerRank] = React.useState<undefined | number>();
    const [isPlayerAdmin, setIsPlayerAdmin] = React.useState<boolean>(false);
    const [playerNumber, setPlayerNumber] = React.useState<number | undefined>();
    const [permission, setPermissionGranted] = React.useState<boolean>(false);
    const history = useHistory();
    const [character, setCharacter] = React.useState<undefined | string>(undefined);
    const [name, setName] = React.useState<string>('');
    // TODO use data from socket
    const [ready, setReady] = React.useState(false);
    const [dead, setPlayerDead] = React.useState(false);
    const [stoneTimeout, setStoneTimeout] = React.useState<undefined | ReturnType<typeof setTimeout>>();

    let reroute = true;

    const content = {
        obstacle,
        setObstacle: (roomId: string | undefined, val: undefined | IObstacle) => {
            setObstacle(val);
            if (val) {
                reroute = true;
                history.push(controllerObstacleRoute(roomId, val.type));
            } else if (reroute) {
                reroute = false;
                history.push(controllerGame1Route(roomId));
            }
        },
        playerFinished,
        setPlayerFinished,
        playerRank,
        setPlayerRank,
        isPlayerAdmin,
        setIsPlayerAdmin,
        permission,
        setPermissionGranted,
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
        stoneTimeout,
        setStoneTimeout,
    };
    return <PlayerContext.Provider value={content}>{children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
