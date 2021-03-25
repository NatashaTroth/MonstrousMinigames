import { GameState } from '../../interfaces';
import { PlayerState } from './';

export { Obstacle } from './';


export interface GameHasStarted {
    roomId: string
    countdownTime: number
}

export interface GameHasFinished {
    roomId: string
    playersState: [PlayerState]
    gameState: GameState
    trackLength: number
    numberOfObstacles: number
}

export interface PlayerHasFinished {
    roomId: string
    userId: string
    rank: number
}
