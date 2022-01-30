import { localDevelopment, pushChasers, showErrors } from '../../../constants';
import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
import { GameState } from '../enums';
import { Difficulty } from '../enums/Difficulty';
import Game from '../Game';
import { verifyGameState } from '../helperFunctions/verifyGameState';
import { IGameInterface } from '../interfaces';
import { GameType } from '../leaderboard/enums/GameType';
import Leaderboard from '../leaderboard/Leaderboard';
import Chasers from './classes/Chasers';
import GameOnePlayersController from './classes/GameOnePlayersController';
import { GameOneMsgType } from './enums';
import GameOneEventEmitter from './GameOneEventEmitter';
import { getInitialParams, InitialParams } from './GameOneInitialParameters';
// import * as InitialGameParameters from './GameOneInitialParameters';
import GameOnePlayer from './GameOnePlayer';
import { createObstacles, getObstacleTypes } from './helperFunctions/initiatePlayerState';
import { GameStateInfo, ObstacleTypeObject } from './interfaces';
import { GameOnePlayerRank } from './interfaces/GameOnePlayerRank';
import { IMessageObstacle } from './interfaces/messageObstacle';
import { IMessageStunPlayer } from './interfaces/messageStunPlayer';

let pushChasersPeriodicallyCounter = 0; // only for localdev testing

interface GameOneInterface extends IGameInterface<GameOnePlayer, GameStateInfo> {
    trackLength: number;
    numberOfObstacles: number;
    obstacleTypes: ObstacleTypeObject[];

    createNewGame(players: Array<User>, trackLength?: number, numberOfObstacles?: number): void;
    getGameStateInfo(): GameStateInfo;
}

export default class GameOne extends Game<GameOnePlayer, GameStateInfo> implements GameOneInterface {
    InitialGameParameters: InitialParams;
    trackLength: number;
    numberOfObstacles: number;
    maxNumberOfChaserPushes: number;
    chaserPushAmount: number;
    numberOfStones: number;
    speed: number;
    countdownTime: number;
    cameraSpeed: number;
    chasersSpeed: number;
    stunnedTime: number;
    approachSolvableObstacleDistance: number;
    initialPlayerPositionX: number;
    chasersPositionX: number;
    cameraPositionX: number;

    obstacleTypes: ObstacleTypeObject[] = [];
    gameName = GameNames.GAME1;
    chasers?: Chasers;
    gameOnePlayersController?: GameOnePlayersController;

    constructor(
        roomId: string,
        public leaderboard: Leaderboard,
        difficulty = Difficulty.MEDIUM,
        private useChasers = true
    ) {
        super(roomId);
        this.gameStateMessage = GameOneMsgType.GAME_STATE;
        this.InitialGameParameters = getInitialParams(difficulty);
        this.trackLength = this.InitialGameParameters.TRACK_LENGTH;
        this.numberOfObstacles = this.InitialGameParameters.NUMBER_OBSTACLES;
        this.maxNumberOfChaserPushes = this.InitialGameParameters.MAX_NUMBER_CHASER_PUSHES;
        this.chaserPushAmount = this.InitialGameParameters.CHASER_PUSH_AMOUNT;
        this.numberOfStones = this.InitialGameParameters.NUMBER_STONES;
        this.speed = this.InitialGameParameters.SPEED;
        this.countdownTime = this.InitialGameParameters.COUNTDOWN_TIME;
        this.cameraSpeed = this.InitialGameParameters.CAMERA_SPEED;
        this.chasersSpeed = this.InitialGameParameters.CHASERS_SPEED;
        this.stunnedTime = this.InitialGameParameters.STUNNED_TIME;
        this.approachSolvableObstacleDistance = this.InitialGameParameters.APPROACH_SOLVABLE_OBSTACLE_DISTANCE;

        this.initialPlayerPositionX = this.InitialGameParameters.PLAYERS_POSITION_X;
        this.chasersPositionX = this.InitialGameParameters.CHASERS_POSITION_X;
        this.cameraPositionX = this.InitialGameParameters.CAMERA_POSITION_X;
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
            this.roomId,
            this.InitialGameParameters
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

        if (this.useChasers) {
            this.chasers!.update(timeElapsed, timeElapsedSinceLastFrame);
            this.checkIfPlayersCaught(Date.now());
        }

        if (localDevelopment) {
            this.updateLocalDev();
        }

        if (this.gameHasFinished()) this.handleGameFinished();
    }

    protected handleInput(message: IMessage) {
        try {
            verifyGameState(this.gameState, [GameState.Started]);
            switch (message.type) {
                case GameOneMsgType.MOVE:
                    this.movePlayer(message);
                    break;
                case GameOneMsgType.OBSTACLE_SOLVED:
                    this.getValidPlayer(message.userId!)?.obstacleCompleted((message as IMessageObstacle).obstacleId);
                    break;
                case GameOneMsgType.SOLVE_OBSTACLE:
                    this.getValidPlayer(message.userId!)?.playerWantsToSolveObstacle(
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
        } catch (e: any) {
            if (showErrors) console.info(e.Message);
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
        this.chasers = new Chasers(this.trackLength, this.roomId, this.InitialGameParameters);
        this.initialPlayerPositionX = this.InitialGameParameters.PLAYERS_POSITION_X;
        this.chasersPositionX = this.InitialGameParameters.CHASERS_POSITION_X;
        this.cameraPositionX = this.InitialGameParameters.CAMERA_POSITION_X;

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

        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.gameOnePlayersController!.getStunnablePlayers());
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
        player?.runForward(parseInt(`${process.env.SPEED}`, 10) || this.InitialGameParameters.SPEED);
        if (player?.playerHasPassedGoal()) {
            this.handlePlayerFinished(player);
        }
    }

    private handlePlayerFinished(player: GameOnePlayer) {
        const finishedTime = Date.now();
        player.handlePlayerFinishedGame(finishedTime, this.rankSuccessfulUser(finishedTime));
        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.gameOnePlayersController!.getStunnablePlayers());

        // if (this.gameHasFinished()) this.handleGameFinished();
    }

    private stunPlayer(userIdStunned: string, userIdThrown: string) {
        const playerThrown = this.getValidPlayer(userIdThrown);
        const playerStunned = this.getValidPlayer(userIdStunned);
        playerThrown?.throwStone();
        playerStunned?.stun();
    }

    // ***** chasers *****
    private checkIfPlayersCaught(currentTime: number) {
        this.gameOnePlayersController!.getCaughtPlayers(this.chasers!.getPosition()).forEach(player => {
            this.handlePlayerCaught(player, currentTime);
        });
    }

    private handlePlayerCaught(player: GameOnePlayer, currentTime: number) {
        player.handlePlayerCaught(currentTime);
        player.rank = this.rankFailedUser(player.finishedTimeMs);

        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.gameOnePlayersController!.getStunnablePlayers());
    }

    private pushChasers(userIdPushing: string) {
        this.gameOnePlayersController!.verifyUserId(userIdPushing);
        const userPushing = this.gameOnePlayersController!.getPlayerById(userIdPushing);

        if (!userPushing.finished || userPushing.maxNumberPushChasersExceeded()) return;

        userPushing.pushChasers();
        this.chasers?.push();
        this.checkIfPlayersCaught(Date.now());
    }

    // ***** game state *****
    private gameHasFinished(): boolean {
        if (this.players.size === 1 || localDevelopment)
            return this.gameOnePlayersController!.getActiveUnfinishedPlayers().length === 0;
        return this.gameOnePlayersController!.getActiveUnfinishedPlayers().length <= 1;
    }

    private handleGameFinished(): void {
        this.gameState = GameState.Finished;
        const playerRanks = this.gameOnePlayersController!.createPlayerRanks(
            this.currentRank,
            this.gameStartedAt,
            this.rankSuccessfulUser,
            this.rankFailedUser,
            this,
            Date.now()
        );
        const gamePoints = this.leaderboard.addGameToHistory(GameType.GameOne, [...playerRanks]);

        const currentGameStateInfo = this.getGameStateInfo();
        // this.gameOnePlayersController?.getPlayerById(playerRank.id).points
        const playerRanksWithPoints: GameOnePlayerRank[] = playerRanks.map(playerRank => {
            return { ...playerRank, points: gamePoints.get(playerRank.id) || 0 };
        });
        GameOneEventEmitter.emitGameHasFinishedEvent(currentGameStateInfo.roomId, currentGameStateInfo.gameState, [
            ...playerRanksWithPoints,
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

    private getValidPlayer(userId: string): GameOnePlayer | undefined {
        this.gameOnePlayersController!.verifyUserId(userId);
        const player = this.gameOnePlayersController!.getPlayerById(userId);
        if (!player.isActive) {
            return undefined;
        }
        return player;
    }

    private updateLocalDev() {
        for (const player of this.gameOnePlayersController!.getPlayerValues()) {
            if (player.positionX < this.trackLength) {
                for (let i = 0; i < 5; i++) {
                    // to test speed limit
                    player.runForward(parseInt(`${process.env.SPEED}`, 10) || this.InitialGameParameters.SPEED);
                }
            }
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
