// import GameEventEmitter from '../../classes/GameEventEmitter';
import { GameState } from './GameState';

export interface GameInterface {
    roomId: string
    playersState: any //TODO change
    gameState: GameState
    // gameEventEmitter: GameEventEmitter;
    currentRank: number

    createNewGame(players: any, trackLength?: number, numberOfObstacles?: number): void
    startGame(): void
    stopGame(): void
    pauseGame(): void
    getGameStateInfo(): any
}
