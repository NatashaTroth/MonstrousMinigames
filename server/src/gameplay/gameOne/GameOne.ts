import { localDevelopment, pushChasers } from '../../../constants';
import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
import { GameState } from '../enums';
import Game from '../Game';
import { verifyGameState } from '../helperFunctions/verifyGameState';
import { verifyUserIsActive } from '../helperFunctions/verifyUserIsActive';
import { IGameInterface } from '../interfaces';
import { GameType } from '../leaderboard/enums/GameType';
import Leaderboard from '../leaderboard/Leaderboard';
import Chasers from './classes/Chasers';
import GameOnePlayersController from './classes/GameOnePlayersController';
import InitialParameters from './constants/InitialParameters';
import { GameOneMsgType } from './enums';
import GameOneEventEmitter from './GameOneEventEmitter';
import GameOnePlayer from './GameOnePlayer';
import { createObstacles, getObstacleTypes } from './helperFunctions/initiatePlayerState';
import { GameStateInfo, ObstacleTypeObject } from './interfaces';
import { IMessageObstacle } from './interfaces/messageObstacle';
import { IMessageStunPlayer } from './interfaces/messageStunPlayer';

let pushChasersPeriodicallyCounter = 0; // only for testing TODO delete

interface GameOneInterface extends IGameInterface<GameOnePlayer, GameStateInfo> {
    trackLength: number;
    numberOfObstacles: number;
    obstacleTypes: ObstacleTypeObject[];

    createNewGame(players: Array<User>, trackLength?: number, numberOfObstacles?: number): void;
    getGameStateInfo(): GameStateInfo;
    // getObstaclePositions(): HashTable<Array<Obstacle>>;
}

export default class GameOne extends Game<GameOnePlayer, GameStateInfo> implements GameOneInterface {
    trackLength = InitialParameters.TRACK_LENGTH;
    numberOfObstacles = InitialParameters.NUMBER_OBSTACLES;
    numberOfStones = InitialParameters.NUMBER_STONES;
    speed = InitialParameters.SPEED;
    countdownTime = InitialParameters.COUNTDOWN_TIME; //should be 1 second more than client - TODO: make sure it is
    cameraSpeed = InitialParameters.CAMERA_SPEED;
    initialPlayerPositionX = InitialParameters.PLAYERS_POSITION_X;
    cameraPositionX = InitialParameters.CAMERA_POSITION_X;
    obstacleTypes: ObstacleTypeObject[] = [];
    gameName = GameNames.GAME1;
    chasers?: Chasers;
    gameOnePlayersController?: GameOnePlayersController;

    constructor(roomId: string, public leaderboard: Leaderboard /*, public usingChasers = false*/) {
        super(roomId);
        this.gameStateMessage = GameOneMsgType.GAME_STATE;
    }

    protected beforeCreateNewGame() {
        this.obstacleTypes = getObstacleTypes(this.numberOfObstacles);
    }

    protected mapUserToPlayer(user: User) {
        const player = new GameOnePlayer(
            user.id,
            user.name,
            this.initialPlayerPositionX,
            createObstacles(this.obstacleTypes, this.numberOfObstacles, this.trackLength, this.initialPlayerPositionX),
            user.characterNumber,
            this.trackLength,
            this.roomId
        );

        player.on(GameOnePlayer.EVT_UNSTUNNED, () => {
            GameOneEventEmitter.emitPlayerIsUnstunned(this.roomId, player.id);
        });

        return player;
    }

    protected postProcessPlayers(
        playersIterable: IterableIterator<GameOnePlayer>,
        playersMap: Map<string, GameOnePlayer>
    ) {
        this.gameOnePlayersController = new GameOnePlayersController(
            playersMap,
            // playersIterable,
            this.trackLength,
            this.initialPlayerPositionX,
            this.numberOfStones
        );
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.cameraPositionX < this.trackLength)
            this.cameraPositionX += (timeElapsedSinceLastFrame / 33) * this.cameraSpeed;

        this.chasers!.update(timeElapsed, timeElapsedSinceLastFrame);
        this.checkIfPlayersCaught();

        if (localDevelopment) {
            this.updateLocalDev();
        }
    }

    protected handleInput(message: IMessage) {
        verifyGameState(this.gameState, [GameState.Started]);
        switch (message.type) {
            case GameOneMsgType.MOVE:
                this.movePlayer(message);
                break;
            case GameOneMsgType.OBSTACLE_SOLVED:
                this.getValidPlayer(message.userId!).obstacleCompleted((message as IMessageObstacle).obstacleId);
                break;
            case GameOneMsgType.SOLVE_OBSTACLE:
                this.getValidPlayer(message.userId!).playerWantsToSolveObstacle(
                    (message as IMessageObstacle).obstacleId
                );
                break;

            case GameOneMsgType.STUN_PLAYER:
                if (
                    !(message as IMessageStunPlayer).receivingUserId ||
                    (message as IMessageStunPlayer).receivingUserId === message.userId
                ) {
                    break;
                }
                this.stunPlayer((message as IMessageStunPlayer).receivingUserId, message.userId!);
                break;
            case GameOneMsgType.CHASERS_WERE_PUSHED:
                this.pushChasers(message.userId!);
                break;
            default:
                console.info(message);
        }
    }

    createNewGame(
        users: Array<User>,
        trackLength = this.trackLength,
        numberOfObstacles = this.numberOfObstacles,
        numberOfStones = this.numberOfStones
    ): void {
        this.trackLength = trackLength;
        this.numberOfObstacles = numberOfObstacles;
        this.numberOfStones = numberOfStones;
        this.initialPlayerPositionX = InitialParameters.PLAYERS_POSITION_X;
        this.cameraPositionX = InitialParameters.CAMERA_POSITION_X;
        this.chasers = new Chasers(this.trackLength, this.roomId);

        super.createNewGame(users);
        const firstGameStateInfo = this.getGameStateInfo();
        GameOneEventEmitter.emitInitialGameStateInfoUpdate(this.roomId, {
            roomId: firstGameStateInfo.roomId,
            trackLength: this.trackLength,
            numberOfObstacles: this.numberOfObstacles,
            playersState: firstGameStateInfo.playersState,
            gameState: firstGameStateInfo.gameState,
            chasersPositionX: firstGameStateInfo.chasersPositionX,
            cameraPositionX: firstGameStateInfo.cameraPositionX,
        });

        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.gameOnePlayersController!.getStunnablePlayers()); // TODO test (test all times this emitter is called)
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
        }, this.countdownTime);

        GameOneEventEmitter.emitGameHasStartedEvent(this.roomId, this.countdownTime, this.gameName);
    }

    pauseGame(): void {
        super.pauseGame();

        GameOneEventEmitter.emitGameHasPausedEvent(this.roomId);
    }

    resumeGame(): void {
        super.resumeGame();

        GameOneEventEmitter.emitGameHasResumedEvent(this.roomId);
    }

    stopGameUserClosed() {
        super.stopGameUserClosed();

        GameOneEventEmitter.emitGameHasStoppedEvent(this.roomId);
    }

    // TODO Test
    stopGameAllUsersDisconnected() {
        super.stopGameAllUsersDisconnected();
    }

    getGameStateInfo(): GameStateInfo {
        return {
            gameState: this.gameState,
            roomId: this.roomId,
            playersState: this.gameOnePlayersController!.getPlayerState(),
            chasersPositionX: this.chasers!.getPosition(),
            cameraPositionX: this.cameraPositionX,
        };
    }

    // ***** player *****
    private movePlayer(message: IMessage) {
        const player = this.getValidPlayer(message.userId!);
        player.runForward(parseInt(`${process.env.SPEED}`, 10) || 2);
        if (player.playerHasPassedGoal()) {
            this.handlePlayerFinished(player);
        }
    }

    private handlePlayerFinished(player: GameOnePlayer) {
        const finishedTime = Date.now();
        player.handlePlayerFinishedGame(finishedTime, this.rankSuccessfulUser(finishedTime));
        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.gameOnePlayersController!.getStunnablePlayers());

        if (this.gameHasFinished()) this.handleGameFinished();
    }

    private stunPlayer(userIdStunned: string, userIdThrown: string) {
        const playerThrown = this.getValidPlayer(userIdThrown);
        const playerStunned = this.getValidPlayer(userIdStunned);
        playerThrown.throwStone();
        playerStunned.stun();
    }

    // ***** chasers *****
    private checkIfPlayersCaught() {
        this.gameOnePlayersController!.getCaughtPlayers(this.chasers!.getPosition()).forEach(player => {
            this.handlePlayerCaught(player);
        });
    }

    private handlePlayerCaught(playerState: GameOnePlayer) {
        playerState.handlePlayerCaught();
        playerState.rank = this.rankFailedUser(playerState.finishedTimeMs);
        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.gameOnePlayersController!.getStunnablePlayers());

        //todo duplicate
        if (localDevelopment) return;

        const activeUnfinishedPlayers = this.gameOnePlayersController!.getActiveUnfinishedPlayers();
        if (activeUnfinishedPlayers.length <= 1 || this.gameHasFinished()) {
            this.handleGameFinished();
        }
    }

    // private chaserHasCaughtPlayer(player: GameOnePlayer) {
    //     return !player.finished && player.positionX <= this.chasers!.getPosition();
    // }

    private pushChasers(userIdPushing: string) {
        this.gameOnePlayersController!.verifyUserId(userIdPushing);
        const userPushing = this.gameOnePlayersController!.getPlayerById(userIdPushing);

        if (!userPushing.finished || userPushing.maxNumberPushChasersExceeded()) return;

        userPushing.pushChasers();
        this.chasers?.push();
        this.checkIfPlayersCaught();
    }

    // ***** game state *****
    private gameHasFinished(): boolean {
        return this.gameOnePlayersController!.getActiveUnfinishedPlayers().length === 0; //TODO - test, does game finish when only 1 player??
    }

    private handleGameFinished(): void {
        this.gameState = GameState.Finished;

        const playerRanks = this.gameOnePlayersController!.createPlayerRanks(this.currentRank, this.gameStartedAt);
        this.leaderboard.addGameToHistory(GameType.GameOne, [...playerRanks]);

        const currentGameStateInfo = this.getGameStateInfo();
        GameOneEventEmitter.emitGameHasFinishedEvent(currentGameStateInfo.roomId, currentGameStateInfo.gameState, [
            ...playerRanks,
        ]);
        //Broadcast, stop game, return ranks
    }

    disconnectPlayer(userId: string) {
        if (super.disconnectPlayer(userId)) {
            GameOneEventEmitter.emitPlayerHasDisconnected(this.roomId, userId);
            GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.gameOnePlayersController!.getStunnablePlayers());

            return true;
        }

        return false;
    }

    reconnectPlayer(userId: string) {
        if (super.reconnectPlayer(userId)) {
            GameOneEventEmitter.emitPlayerHasReconnected(this.roomId, userId);
            GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.gameOnePlayersController!.getStunnablePlayers());
            return true;
        }

        return false;
    }

    //******** other *********

    private getValidPlayer(userId: string): GameOnePlayer {
        this.gameOnePlayersController!.verifyUserId(userId);
        const player = this.gameOnePlayersController!.getPlayerById(userId);
        verifyUserIsActive(userId, player.isActive);
        return player;
    }

    private updateLocalDev() {
        for (const player of this.gameOnePlayersController!.getPlayerValues()) {
            if (player.positionX < this.trackLength) {
                for (let i = 0; i < 5; i++) {
                    // to test speed limit
                    player.runForward(parseInt(`${process.env.SPEED}`, 10) || 2);
                    // if (player.playerHasPassedGoal()) this.playerHasFinishedGame(); //TODO!!

                    // this.runForward(player.id, ((this.speed / 14) * timeElapsedSinceLastFrame) / 1);
                }
            }
            // push chasers TODO delete
            if (pushChasers) {
                if (pushChasersPeriodicallyCounter >= 100) {
                    pushChasersPeriodicallyCounter = 0;
                    this.pushChasers(player.id!);
                }
                pushChasersPeriodicallyCounter++;
            }
        }
    }
}
