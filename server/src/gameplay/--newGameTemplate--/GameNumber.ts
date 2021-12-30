import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import InitialParameters from './constants/InitialParameters';
import GameNumberEventEmitter from './GameNumberEventEmitter';
// import { GameNumberMessageTypes } from './enums/GameNumberMessageTypes';
import GameNumberPlayer from './GameNumberPlayer';
import { GameStateInfo } from './interfaces/GameStateInfo';

type GameNumberGameInterface = IGameInterface<GameNumberPlayer, GameStateInfo>;

export default class GameNumber extends Game<GameNumberPlayer, GameStateInfo> implements GameNumberGameInterface {
    countdownTime = InitialParameters.COUNTDOWN_TIME;
    gameName = GameNames.GAMEX;
    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);

        console.info(this);
    }

    getGameStateInfo(): GameStateInfo {
        return {
            gameState: this.gameState,
            roomId: this.roomId,
        };
    }

    protected beforeCreateNewGame() {
        return;
    }

    protected mapUserToPlayer(user: User): GameNumberPlayer {
        const player = new GameNumberPlayer(user.id, user.name, user.characterNumber);
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

        GameNumberEventEmitter.emitGameHasStartedEvent(this.roomId, this.countdownTime, this.gameName);
    }

    pauseGame(): void {
        super.pauseGame();

        GameNumberEventEmitter.emitGameHasPausedEvent(this.roomId);
    }

    resumeGame(): void {
        super.resumeGame();

        GameNumberEventEmitter.emitGameHasResumedEvent(this.roomId);
    }

    stopGameUserClosed() {
        super.stopGameUserClosed();

        GameNumberEventEmitter.emitGameHasStoppedEvent(this.roomId);
    }

    stopGameAllUsersDisconnected() {
        super.stopGameAllUsersDisconnected();
    }

    protected handleInput(message: IMessage) {
        switch (message.type) {
            // case GameNumberMessageTypes.MOVE:
            //     this.movePlayer(message.userId!, message.direction!);
            //     break;
            // case GameNumberMessageTypes.KILL:
            //     this.killSheep(message.userId!);
            //     break;
            default:
                console.info(message);
        }
    }
}
