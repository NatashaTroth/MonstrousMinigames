import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
import { GameState } from '../enums';
// import { GameState } from '../enums';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import { StageController } from './classes/StageController';
import StageEventEmitter from './classes/StageEventEmitter';
import InitialParameters from './constants/InitialParameters';
import GameThreeEventEmitter from './GameThreeEventEmitter';
// import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreePlayer from './GameThreePlayer';
import { GameStateInfo } from './interfaces';
import { GameThreePlayerRank } from './interfaces/GameThreePlayerRank';

type GameThreeGameInterface = IGameInterface<GameThreePlayer, GameStateInfo>;

//Object calisthenics
//God object anti pattern
//welche daten gehören zusammen - countdown objekt - hat eigene update methode - wenn was keine überschneidung dann rausziehen
//tdd as if you meant it
// extract class refactoring martin fowler
export default class GameThree extends Game<GameThreePlayer, GameStateInfo> implements GameThreeGameInterface {
    // TODO set in create new game so workds for reset
    private stageController?: StageController;
    private stageEventEmitter?: StageEventEmitter;
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
            this.startGameAfterTimeout();
        }, InitialParameters.COUNTDOWN_TIME_GAME_START);

        GameThreeEventEmitter.emitGameHasStartedEvent(
            this.roomId,
            InitialParameters.COUNTDOWN_TIME_GAME_START,
            this.gameName
        );
        // this.stageController?.handleNewRound();
    }

    startGameAfterTimeout() {
        this.stageController = new StageController(
            this.roomId,
            Array.from(this.players.values()).map(player => {
                return { id: player.id, name: player.name };
            }),
            this.testNumber
        );
        this.stageEventEmitter = StageEventEmitter.getInstance();
        this.stageEventEmitter.on(StageEventEmitter.GAME_FINISHED, message => {
            this.handleGameFinished();
        });
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

    handleInput(message: IMessage) {
        this.stageController?.handleInput(message);
    }

    handleGameFinished() {
        const playerPoints = this.stageController!.getPlayerPoints();
        const playerRanks: GameThreePlayerRank[] = Array.from(this.players.values()).map(player => {
            return {
                id: player.id,
                name: player.name,
                points: playerPoints.get(player.id) || 0,
                rank: 0,
                isActive: player.isActive,
            };
        });

        playerRanks
            .sort((a, b) => b.points - a.points)
            .map(result => {
                const rank = this.rankSuccessfulUser(result.points);
                this.players.get(result.id)!.rank = rank;
                result.rank = rank;
                return result;
            });

        this.gameState = GameState.Finished;
        GameThreeEventEmitter.emitGameHasFinishedEvent(this.roomId, GameState.Finished, playerRanks);
    }
}
