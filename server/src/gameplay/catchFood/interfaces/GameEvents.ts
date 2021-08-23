import { GameState } from '../../enums';
import { ObstacleType } from '../enums';
import { GameStateInfo, PlayerRank } from './';

interface GameEventInterface {
    roomId: string;
}

export interface GameStateInfoUpdate extends GameEventInterface {
    roomId: string;
    gameStateInfo: GameStateInfo;
}
export interface StartPhaserGame extends GameEventInterface {
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

export interface PlayerIsDead extends GameEventInterface {
    roomId: string;
    userId: string;
    rank: number;
}
export interface PlayerStunnedState extends GameEventInterface {
    roomId: string;
    userId: string;
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

export interface PlayerHasReconnectedInfo extends GameEventInterface {
    roomId: string;
    userId: string;
}
