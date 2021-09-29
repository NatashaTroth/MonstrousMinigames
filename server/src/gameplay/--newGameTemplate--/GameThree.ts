import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import InitialParameters from './constants/InitialParameters';
import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreePlayer from './GameThreePlayer';
import { GameStateInfo } from './interfaces/GameStateInfo';

interface GameThreeGameInterface extends IGameInterface<GameThreePlayer, GameStateInfo> {}

export default class GameThree extends Game<GameThreePlayer, GameStateInfo> implements GameThreeGameInterface {
    countdownTime = InitialParameters.COUNTDOWN_TIME;

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);

        console.log('game3 created');
        console.info(this);
    }

    getGameStateInfo(): GameStateInfo {
        return {
            gameState: this.gameState,
            roomId: this.roomId,
        };
    }

    protected beforeCreateNewGame() {
        console.error('Unimplemented Method');
    }

    protected mapUserToPlayer(user: User): GameThreePlayer {
        const player = new GameThreePlayer(user.id, user.name);
        console.info(player);
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        console.error('Unimplemented Method');
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        console.error('Unimplemented Method');
    }

    createNewGame(users: Array<User>) {
        super.createNewGame(users);
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
        }, this.countdownTime);
    }
    pauseGame(): void {
        super.pauseGame();
    }

    resumeGame(): void {
        super.resumeGame();
    }

    stopGameUserClosed() {
        super.stopGameUserClosed();
    }

    stopGameAllUsersDisconnected() {
        super.stopGameAllUsersDisconnected();
    }

    protected handleInput(message: IMessage) {
        switch (message.type) {
            // case GameThreeMessageTypes.MOVE:
            //     this.movePlayer(message.userId!, message.direction!);
            //     break;
            // case GameThreeMessageTypes.KILL:
            //     this.killSheep(message.userId!);
            //     break;
            default:
                console.info(message);
        }
    }
}
