import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import { GameState } from '../enums/GameState';
import Player from '../Player';
// import GameEventEmitter from '../../classes/GameEventEmitter';
import { IGameStateBase } from './IGameStateBase';

export interface IGameInterface<TPlayer extends Player, TGameState extends IGameStateBase> {
    roomId: string;
    players: Map<string, TPlayer>;
    gameState: GameState;

    createNewGame(players: Array<User>): void;
    stopGameUserClosed(): void;
    stopGameAllUsersDisconnected(): void;
    pauseGame(): void;
    getGameStateInfo(): TGameState;
    disconnectPlayer(userId: string): void;
    receiveInput(message: IMessage): Promise<void> | void;
}
