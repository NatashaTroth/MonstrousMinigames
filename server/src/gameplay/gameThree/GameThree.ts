import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import { RandomWordGenerator } from './classes/RandomWordGenerator';
import InitialParameters from './constants/InitialParameters';
import GameThreeEventEmitter from './GameThreeEventEmitter';
// import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreePlayer from './GameThreePlayer';
import { GameStateInfo } from './interfaces/GameStateInfo';

type GameThreeGameInterface = IGameInterface<GameThreePlayer, GameStateInfo>;

export default class GameThree extends Game<GameThreePlayer, GameStateInfo> implements GameThreeGameInterface {
    private countdownTime = InitialParameters.COUNTDOWN_TIME;
    private topics?: string[];
    private randomWordGenerator = new RandomWordGenerator();
    private numberTopics = InitialParameters.NUMBER_TOPICS;

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
        return;
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
        this.topics = this.randomWordGenerator.generateRandomWords(this.numberTopics);
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
        }, this.countdownTime);
        GameThreeEventEmitter.emitGameHasStartedEvent(this.roomId, this.countdownTime);
        this.sendTopic();
    }

    sendTopic() {
        //send to client
    }

    pauseGame(): void {
        super.pauseGame();
        GameThreeEventEmitter.emitGameHasPausedEvent(this.roomId);
    }

    resumeGame(): void {
        super.resumeGame();
        GameThreeEventEmitter.emitGameHasResumedEvent(this.roomId);
    }

    stopGameUserClosed() {
        super.stopGameUserClosed();
        GameThreeEventEmitter.emitGameHasStoppedEvent(this.roomId);
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
