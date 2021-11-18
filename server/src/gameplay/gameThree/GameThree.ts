import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
// import { GameState } from '../enums';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import { StageController } from './classes/StageController';
import InitialParameters from './constants/InitialParameters';
import GameThreeEventEmitter from './GameThreeEventEmitter';
// import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreePlayer from './GameThreePlayer';
import { GameStateInfo } from './interfaces';

type GameThreeGameInterface = IGameInterface<GameThreePlayer, GameStateInfo>;

//Object calisthenics
//God object anti pattern
//welche daten gehören zusammen - countdown objekt - hat eigene update methode - wenn was keine überschneidung dann rausziehen
//tdd as if you meant it
// extract class refactoring martin fowler
export default class GameThree extends Game<GameThreePlayer, GameStateInfo> implements GameThreeGameInterface {
    // TODO set in create new game so workds for reset
    private stageController?: StageController;

    // private roundIdx = -1;
    // private playerPresentOrder: string[] = [];
    gameName = GameNames.GAME3;

    constructor(roomId: string, public leaderboard: Leaderboard, private testNumber = 1) {
        super(roomId);
        this.sendGameStateUpdates = false;
    }

    getGameStateInfo(): GameStateInfo {
        //TODO do i need to send this? think not
        return {
            gameState: this.gameState,
            roomId: this.roomId,
        };
    }

    protected beforeCreateNewGame() {
        return;
    }

    protected mapUserToPlayer(user: User): GameThreePlayer {
        const player = new GameThreePlayer(user.id, user.name, user.characterNumber);

        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        this.stageController?.update(timeElapsedSinceLastFrame);
        // if(this.stageController!.stage === GameThreeGameState.ViewingFinalResults){

        // }
    }

    // *** Round Change ***

    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        //TODO
    }

    createNewGame(users: Array<User>) {
        super.createNewGame(users);
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
            this.stageController = new StageController(this.roomId, this.players, this.testNumber);
        }, InitialParameters.COUNTDOWN_TIME_GAME_START);

        GameThreeEventEmitter.emitGameHasStartedEvent(
            this.roomId,
            InitialParameters.COUNTDOWN_TIME_GAME_START,
            this.gameName
        );
        this.stageController?.handleNewRound();
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
        this.stageController?.handleInput(message);

        //TODO validate inputs - like correct userId...
        // switch (message.type) {
        //     case GameThreeMessageTypes.PHOTO: {
        //         // TODO check    const player = this.players.get(message.userId!);
        //         this.stageController!.handleReceivedPhoto(message as IMessagePhoto);
        //         break;
        //     }
        //     case GameThreeMessageTypes.PHOTO_VOTE: {
        //         // TODO check they exist
        //         // const player = this.players.get(message.photographerId!);
        //         // const voter = this.players.get(message.voterId);
        //         this.stageController!.handleReceivedPhotoVote(message as IMessagePhotoVote);
        //         break;
        //     }
        //     case GameThreeMessageTypes.FINISHED_PRESENTING: {
        //         this.stageController!.handleNewPresentationRound();

        //         break;
        //     }
        //     default:
        //         console.info(message);
        // }
    }
}
