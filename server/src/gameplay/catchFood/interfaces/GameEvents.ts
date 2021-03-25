import { GameState } from '../../interfaces';
import { ObstacleType, PlayerState } from './';

// export { Obstacle } from './';


export interface GameHasStarted {
    roomId: string
    countdownTime: number
}

export interface GameHasFinished {
    roomId: string
    playersState: Array<PlayerState>
    gameState: GameState
    trackLength: number
    numberOfObstacles: number
}

export interface PlayerHasFinished {
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
