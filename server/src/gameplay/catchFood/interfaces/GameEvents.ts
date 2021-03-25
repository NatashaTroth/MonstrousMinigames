import { GameState } from '../../interfaces';
import { ObstacleType, PlayerState } from './';

interface GameEventInterface {
    roomId: string
}

export interface GameHasStarted extends GameEventInterface {
    roomId: string
    countdownTime: number
}

export interface GameHasFinished extends GameEventInterface {
    roomId: string
    playersState: Array<PlayerState>
    gameState: GameState
    trackLength: number
    numberOfObstacles: number
}

export interface GameHasStopped extends GameEventInterface {
    roomId: string
}

export interface PlayerHasFinished extends GameEventInterface {
    roomId: string
    userId: string
    rank: number
}

export interface ObstacleReachedInfo extends GameEventInterface {
    roomId: string
    userId: string
    obstacleType: ObstacleType
    obstacleId: number
}
