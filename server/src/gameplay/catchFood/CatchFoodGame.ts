import { localDevelopment } from '../../../constants';
import User from '../../classes/user';
import { IMessageObstacle } from '../../interfaces/messageObstacle';
import { IMessage } from '../../interfaces/messages';
import { GameState } from '../enums';
import Game from '../Game';
import { verifyGameState } from '../helperFunctions/verifyGameState';
import { verifyUserId } from '../helperFunctions/verifyUserId';
import { verifyUserIsActive } from '../helperFunctions/verifyUserIsActive';
import { HashTable, IGameInterface } from '../interfaces';
import { GameType } from '../leaderboard/enums/GameType';
import Leaderboard from '../leaderboard/Leaderboard';
import CatchFoodGameEventEmitter from './CatchFoodGameEventEmitter';
import CatchFoodPlayer from './CatchFoodPlayer';
import { NotAtObstacleError, WrongObstacleIdError } from './customErrors';
import { CatchFoodMsgType } from './enums';
import { createObstacles, getObstacleTypes } from './helperFunctions/initiatePlayerState';
import {
    GameEvents, GameStateInfo, Obstacle, PlayerRank
} from './interfaces';

interface CatchFoodGameInterface extends IGameInterface<CatchFoodPlayer, GameStateInfo> {
    trackLength: number;
    numberOfObstacles: number;

    createNewGame(players: Array<User>, trackLength?: number, numberOfObstacles?: number): void;
    getGameStateInfo(): GameStateInfo;
    getObstaclePositions(): HashTable<Array<Obstacle>>;
}

export default class CatchFoodGame extends Game<CatchFoodPlayer, GameStateInfo> implements CatchFoodGameInterface {
    trackLength = 5000;
    numberOfObstacles = 4;
    speed = 0;
    timeOutLimit = 300000;
    countdownTime = 4000; //should be 1 second more than client - TODO: make sure it is
    timeWhenChasersAppear = 25000; //10 sec
    // usingChasers: boolean //TODO try and remove (for tests)
    initialPlayerPositionX = 500;
    chasersPositionX = 1350;
    updateChasersIntervalTime = 100;
    chasersAreRunning = false;
    cameraPositionX = 0;
    cameraSpeed = 1.7;
    maxNumberStones = 5;

    constructor(roomId: string, public leaderboard: Leaderboard /*, public usingChasers = false*/, public stunnedTime = 3000) {
        super(roomId);
    }

    createNewGame(
        users: Array<User>,
        trackLength = this.trackLength,
        numberOfObstacles = this.numberOfObstacles,
        speed = 2
    ): void {
        this.trackLength = trackLength;
        this.numberOfObstacles = numberOfObstacles;
        this.speed = speed;
        this.chasersPositionX = 1350;
        // this.chasersPositionX = (6 * this.speed * this.timeWhenChasersAppear) / 100; //(6 updates per 100ms)

        super.createNewGame(users);

        this.startGame();
    }
    protected mapUserToPlayer(user: User) {
        const player = new CatchFoodPlayer(
            user.id,
            user.name,
            this.initialPlayerPositionX,
            createObstacles(getObstacleTypes(this.numberOfObstacles), this.numberOfObstacles, this.trackLength, this.initialPlayerPositionX),
            user.characterNumber,
        );

        player.on(CatchFoodPlayer.EVT_UNSTUNNED, () => {
            this.onPlayerUnstunned(player.id);
        });

        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.cameraPositionX < this.trackLength)
            this.cameraPositionX += timeElapsedSinceLastFrame / 33 * this.cameraSpeed;
        this.updateChasersPosition(timeElapsed, timeElapsedSinceLastFrame);

        if (localDevelopment) {
            for (const player of this.players.values()) {
                if (player.positionX >= this.trackLength) {
                    continue;
                }

                this.runForward(player.id, this.speed / 18 * timeElapsedSinceLastFrame);
            }
        }

        if (timeElapsed >= this.timeOutLimit && this.gameState === GameState.Started) {
            this.stopGameTimeout();
        }
    }
    protected handleInput(message: IMessage) {
        switch (message.type) {
            case CatchFoodMsgType.MOVE:
                this.runForward(message.userId!, parseInt(`${process.env.SPEED}`, 10) || 2);
                break;
            case CatchFoodMsgType.OBSTACLE_SOLVED:
                this.playerHasCompletedObstacle(message.userId!, (message as IMessageObstacle).obstacleId);
                break;
            case CatchFoodMsgType.STUN_PLAYER:
                if (!message.receivingUserId) {
                    break;
                }
                this.stunPlayer(message.receivingUserId, message.userId!);
                break;
            default:
                console.info(message);
        }
    }
    startGame(): void {
        setTimeout(() => {
            super.startGame();
        }, this.countdownTime);

        CatchFoodGameEventEmitter.emitGameHasStartedEvent({
            roomId: this.roomId,
            countdownTime: this.countdownTime,
        });
    }
    pauseGame(): void {
        super.pauseGame();

        CatchFoodGameEventEmitter.emitGameHasPausedEvent({ roomId: this.roomId });
    }
    resumeGame(): void {
        super.resumeGame();

        CatchFoodGameEventEmitter.emitGameHasResumedEvent({ roomId: this.roomId });
    }
    private stopGameTimeout() {
        this.stopGame();

        const currentGameStateInfo = this.getGameStateInfo();
        const messageInfo: GameEvents.GameHasFinished = {
            roomId: currentGameStateInfo.roomId,
            gameState: currentGameStateInfo.gameState,
            trackLength: currentGameStateInfo.trackLength,
            numberOfObstacles: currentGameStateInfo.numberOfObstacles,
            playerRanks: [...this.createPlayerRanks()],
        };

        CatchFoodGameEventEmitter.emitGameHasTimedOutEvent(messageInfo);
    }
    stopGameUserClosed() {
        super.stopGameUserClosed();

        CatchFoodGameEventEmitter.emitGameHasStoppedEvent({ roomId: this.roomId });
    }
    stopGameAllUsersDisconnected() {
        super.stopGameAllUsersDisconnected();

        CatchFoodGameEventEmitter.emitAllPlayersHaveDisconnected({ roomId: this.roomId });
    }
    getGameStateInfo(): GameStateInfo {
        return {
            gameState: this.gameState,
            roomId: this.roomId,
            playersState: Array.from(this.players.values()).map(player => ({
                id: player.id,
                name: player.name,
                positionX: player.positionX,
                obstacles: player.obstacles,
                atObstacle: player.atObstacle,
                finished: player.finished,
                finishedTimeMs: player.finishedTimeMs,
                dead: player.dead,
                rank: player.rank,
                isActive: player.isActive,
                stunned: player.stunned,
                characterNumber: player.characterNumber,
                numberStonesThrown: player.numberStonesThrown,
            })),
            trackLength: this.trackLength,
            numberOfObstacles: this.numberOfObstacles,
            chasersPositionX: this.chasersPositionX,
            chasersAreRunning: this.chasersAreRunning,
            cameraPositionX: this.cameraPositionX,
        };
    }
    //TODO test
    private updateChasersPosition(timeElapsed: number, timeElapsedSinceLastFrame: number) {
        //10000 to 90000  * timePassed //TODO - make faster over time??
        if (timeElapsed < this.timeWhenChasersAppear) return;
        if (!this.chasersAreRunning) this.chasersAreRunning = true;
        if (this.chasersPositionX > this.trackLength) return;
        this.chasersPositionX += (timeElapsedSinceLastFrame / this.updateChasersIntervalTime) * this.cameraSpeed * 3;

        //TODO test
        for (const player of this.players.values()) {
            if (!player.finished && this.chaserCaughtPlayer(player)) {
                this.handlePlayerCaught(player);
            }
        }
    }
    private handlePlayerCaught(playerState: CatchFoodPlayer) {
        playerState.dead = true;
        this.updatePlayerStateFinished(playerState.id);
        playerState.rank = this.rankFailedUser(playerState.finishedTimeMs);
        CatchFoodGameEventEmitter.emitPlayerIsDead({
            roomId: this.roomId,
            userId: playerState.id,
            rank: playerState.rank,
        });
        //todo duplicate
        if (!localDevelopment) {
            const players = Array.from(this.players.values());
            const activeUnfinishedPlayers = players.filter(player => player.isActive && !player.dead);
            if (activeUnfinishedPlayers.length <= 1 || this.gameHasFinished()) {
                this.handleGameFinished();
            }
        }
    }
    private chaserCaughtPlayer(player: CatchFoodPlayer) {
        return player.positionX <= this.chasersPositionX;
    }
    getObstaclePositions(): HashTable<Array<Obstacle>> {
        const obstaclePositions: HashTable<Array<Obstacle>> = {};
        for (const player of this.players.values()) {
            obstaclePositions[player.id] = [...player.obstacles];
        }

        return obstaclePositions;
    }
    private runForward(userId: string, speed = 1): void {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userId);
        verifyUserIsActive(userId, this.players.get(userId)!.isActive);

        const player = this.players.get(userId)!;
        if (this.playerIsNotAllowedToRun(userId) || player.stunned) return;

        player.positionX += Math.abs(speed);

        if (this.playerHasReachedObstacle(userId)) this.handlePlayerReachedObstacle(userId);
        if (this.playerHasPassedGoal(userId)) this.playerHasFinishedGame(userId);
    }
    private playerIsNotAllowedToRun(userId: string) {
        const player = this.players.get(userId)!;

        return (
            player.finished || player.dead || player.atObstacle
        );
    }
    private playerHasReachedObstacle(userId: string): boolean {
        const player = this.players.get(userId);

        return (
            (player?.obstacles?.length || 0) > 0 &&
            (player?.positionX || 0) >= (player?.obstacles?.[0]?.positionX || 0)
        );
    }
    private playerHasPassedGoal(userId: string): boolean {
        const player = this.players.get(userId)!;

        return (
           player.positionX >= this.trackLength && player.obstacles.length === 0
        );
    }
    private handlePlayerReachedObstacle(userId: string): void {
        const player = this.players.get(userId)!;
        // block player from running when obstacle is reached
        player.atObstacle = true;

        //set position x to obstacle position (in case ran past)
        player.positionX = player.obstacles[0].positionX;
        CatchFoodGameEventEmitter.emitObstacleReachedEvent({
            roomId: this.roomId,
            userId,
            obstacleType: player.obstacles[0].type,
            obstacleId: player.obstacles[0].id,
        });
    }
    //TODO test
    private stunPlayer(userIdStunned: string, userIdThrown: string) {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userIdStunned);
        verifyUserIsActive(userIdStunned, this.players.get(userIdStunned)!.isActive);
        const playerStunned = this.players.get(userIdStunned)!;
        const playerThrown = this.players.get(userIdThrown)!;
        if (this.playerIsNotAllowedToRun(userIdStunned)) return;
        if (playerStunned.stunned || playerStunned.atObstacle) return;
        if (playerThrown.numberStonesThrown >= this.maxNumberStones) return;
        playerThrown.numberStonesThrown++;
        playerStunned.stunned = true;
        playerStunned.stunnedSeconds = this.stunnedTime;

        CatchFoodGameEventEmitter.emitPlayerIsStunned({
            roomId: this.roomId,
            userId: userIdStunned,
        });
    }
    //TODO test
    private onPlayerUnstunned(userId: string) {
        CatchFoodGameEventEmitter.emitPlayerIsUnstunned({
            roomId: this.roomId,
            userId: userId,
        });
    }
    private playerHasCompletedObstacle(userId: string, obstacleId: number): void {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userId);
        verifyUserIsActive(userId, this.players.get(userId)!.isActive);

        this.verifyUserIsAtObstacle(userId);
        
        const player = this.players.get(userId)!;
        player.atObstacle = false;
        if (player.obstacles[0].id === obstacleId) {
            player.obstacles.shift();
        } else {
            throw new WrongObstacleIdError(`${obstacleId} is not the id for the next obstacle.`, userId, obstacleId);
        }
    }
    private verifyUserIsAtObstacle(userId: string) {
        const player = this.players.get(userId);
        if (
            !player?.atObstacle
            // ||
            // player?.positionX !== player?.obstacles?.[0]?.positionX
        ) {
            throw new NotAtObstacleError(`User ${userId} is not at an obstacle`, userId);
        }
    }
    private playerHasFinishedGame(userId: string): void {
        //only if player hasn't already been marked as finished
        // if (this.playersState[userId].finished) return; //don't think I need

        const player = this.players.get(userId)!;
        this.updatePlayerStateFinished(userId);
        player.rank = this.rankSuccessfulUser(player.finishedTimeMs);
        player.positionX = this.trackLength;

        CatchFoodGameEventEmitter.emitPlayerHasFinishedEvent({
            userId,
            roomId: this.roomId,
            rank: player.rank,
        });

        if (this.gameHasFinished()) {
            this.handleGameFinished();
        }
    }
    private updatePlayerStateFinished(userId: string) {
        const player = this.players.get(userId)!;
        player.finished = true;
        player.finishedTimeMs = Date.now();
    }
    private gameHasFinished(): boolean {
        const players = Array.from(this.players.values());
        const activeUnfinishedPlayers = players.filter(player => player.isActive && !player.finished);

        return activeUnfinishedPlayers.length === 0;
    }
    private handleGameFinished(): void {
        this.gameState = GameState.Finished;

        const playerRanks = this.createPlayerRanks();
        this.leaderboard.addGameToHistory(GameType.CatchFoodGame, [...playerRanks]);

        const currentGameStateInfo = this.getGameStateInfo();
        CatchFoodGameEventEmitter.emitGameHasFinishedEvent({
            roomId: currentGameStateInfo.roomId,
            gameState: currentGameStateInfo.gameState,
            trackLength: currentGameStateInfo.trackLength,
            numberOfObstacles: currentGameStateInfo.numberOfObstacles,
            playerRanks: [...playerRanks],
        });
        //Broadcast, stop game, return ranks
    }
    createPlayerRanks(): Array<PlayerRank> {
        return Array.from(this.players.values()).map(player => ({
            id: player.id,
            name: player.name,
            rank: player.finished ? player.rank : this.currentRank,
            finished: player.finished,
            dead: player.dead,
            totalTimeInMs: (player.finishedTimeMs > 0 ? player.finishedTimeMs : Date.now()) - this.gameStartedAt,
            positionX: player.positionX,
            isActive: player.isActive,
        }));
    }
    disconnectPlayer(userId: string) {
        if (super.disconnectPlayer(userId)) {
            CatchFoodGameEventEmitter.emitPlayerHasDisconnected({
                roomId: this.roomId,
                userId,
            });
            return true;
        }

        return false;
    }
    reconnectPlayer(userId: string) {
        if (super.reconnectPlayer(userId)) {
            CatchFoodGameEventEmitter.emitPlayerHasReconnected({
                roomId: this.roomId,
                userId,
            });

            return true;
        }

        return false;
    }
}
