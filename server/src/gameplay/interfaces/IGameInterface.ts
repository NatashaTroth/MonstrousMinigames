import User from '../../classes/user';
import { GameStateInfo } from '../catchFood/interfaces';
import { GameState } from '../enums/GameState';
// import GameEventEmitter from '../../classes/GameEventEmitter';
import { HashTable, IPlayerState } from './';

export interface IGameInterface {
    roomId: string;
    playersState: HashTable<IPlayerState>;
    gameState: GameState;
    currentRank: number;

    createNewGame(players: Array<User>, trackLength?: number, numberOfObstacles?: number): void;
    // private startGame()
    // stopGameTimeout(): void;
    stopGameUserClosed(): void;
    stopGameAllUsersDisconnected(): void;
    pauseGame(): void;
    getGameStateInfo(): GameStateInfo;
    disconnectPlayer(userId: string): void;
}
