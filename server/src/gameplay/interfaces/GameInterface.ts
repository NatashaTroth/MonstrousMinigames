import User from '../../classes/user';
import { GameStateInfo, PlayerState } from '../catchFood/interfaces';
// import GameEventEmitter from '../../classes/GameEventEmitter';
import { HashTable } from './';
import { GameState } from './GameState';

export interface GameInterface {
    roomId: string;
    playersState: HashTable<PlayerState>; //TODO change for each game -> use ||
    gameState: GameState;
    currentRank: number;

    createNewGame(players: Array<User>, trackLength?: number, numberOfObstacles?: number): void;
    // private startGame()
    stopGame(): void;
    pauseGame(): void;
    getGameStateInfo(): GameStateInfo;
    disconnectPlayer(userId: string): void;
}
