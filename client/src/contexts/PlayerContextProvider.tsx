import * as React from 'react';
import { useHistory } from 'react-router';

import { Obstacles } from '../utils/constants';
import { GameContext } from './GameContextProvider';

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
};
export interface IObstacle {
    type: Obstacles;
    id: number;
}
interface IPlayerContext {
    obstacle: undefined | IObstacle;
    setObstacle: (val: IObstacle | undefined) => void;
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
}

export const PlayerContext = React.createContext<IPlayerContext>(defaultValue);

const PlayerContextProvider: React.FunctionComponent = ({ children }) => {
    const [obstacle, setObstacle] = React.useState<undefined | IObstacle>();
    const [playerFinished, setPlayerFinished] = React.useState<boolean>(false);
    const [playerRank, setPlayerRank] = React.useState<undefined | number>();
    const [isPlayerAdmin, setIsPlayerAdmin] = React.useState<boolean>(false);
    const [playerNumber, setPlayerNumber] = React.useState<number | undefined>();
    const [permission, setPermissionGranted] = React.useState<boolean>(false);
    const history = useHistory();
    const { roomId } = React.useContext(GameContext);
    let reroute = true;

    const content = {
        obstacle,
        setObstacle: (val: undefined | IObstacle) => {
            setObstacle(val);
            if (val) {
                reroute = true;
                history.push(`/controller/${roomId}/${val.type.toLowerCase()}`);
            } else if (reroute) {
                reroute = false;
                history.push(`/controller/${roomId}/game1`);
            }
        },
        playerFinished,
        setPlayerFinished: (val: boolean) => {
            setPlayerFinished(val);
            if (val) {
                history.push(`/controller/${roomId}/finished`);
            }
        },
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
    };
    return <PlayerContext.Provider value={content}>{children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
