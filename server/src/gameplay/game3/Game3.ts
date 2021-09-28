import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameStateBase } from '../interfaces/IGameStateBase';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';

export default class Game3 extends Game {
    getGameStateInfo(): IGameStateBase {
        throw new Error('Method not implemented.');
    }
    protected mapUserToPlayer(user: User): Player {
        throw new Error('Method not implemented.');
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        throw new Error('Method not implemented.');
    }
    protected handleInput(message: IMessage): void | Promise<void> {
        throw new Error('Method not implemented.');
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        throw new Error('Method not implemented.');
    }

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
        console.log('game3 created');
    }
}
