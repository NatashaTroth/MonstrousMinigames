import { GameState } from '../../interfaces';
import { ObstacleType } from './';
import { PlayerRank } from './PlayerRank';

interface GameEventInterface {
    roomId: string;
}

export interface GameHasStarted extends GameEventInterface {
    roomId: string;
    countdownTime: number;
}

export interface GameStateHasChanged extends GameEventInterface {
    roomId: string;
}

export interface PlayerHasFinished extends GameEventInterface {
    roomId: string;
    userId: string;
    rank: number;
}

export interface GameHasFinished extends GameEventInterface {
    roomId: string;
    gameState: GameState;
    trackLength: number;
    numberOfObstacles: number;
    playerRanks: Array<PlayerRank>;
}
export interface ObstacleReachedInfo extends GameEventInterface {
    roomId: string;
    userId: string;
    obstacleId: number;
    obstacleType: ObstacleType;
}

export interface PlayerHasDisconnectedInfo extends GameEventInterface {
    roomId: string;
    userId: string;
}
