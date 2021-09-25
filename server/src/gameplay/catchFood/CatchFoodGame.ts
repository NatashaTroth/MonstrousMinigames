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
import * as InitialGameParameters from './CatchFoodGameInitialParameters';
import CatchFoodPlayer from './CatchFoodPlayer';
import { NotAtObstacleError, WrongObstacleIdError } from './customErrors';
import ObstacleNotSkippable from './customErrors/ObstacleNotSkippable';
import UserHasNoStones from './customErrors/UserHasNoStones';
import { CatchFoodMsgType, ObstacleType } from './enums';
import {
    createObstacles, getObstacleTypes, getStonesForObstacles, sortBy
} from './helperFunctions/initiatePlayerState';
import { GameStateInfo, Obstacle, PlayerRank } from './interfaces';
import { ObstacleReachedInfoController } from './interfaces/GameEvents';

interface CatchFoodGameInterface extends IGameInterface<CatchFoodPlayer, GameStateInfo> {
    trackLength: number;
    numberOfObstacles: number;

    createNewGame(players: Array<User>, trackLength?: number, numberOfObstacles?: number): void;
    getGameStateInfo(): GameStateInfo;
    getObstaclePositions(): HashTable<Array<Obstacle>>;
}

export default class CatchFoodGame extends Game<CatchFoodPlayer, GameStateInfo> implements CatchFoodGameInterface {
    trackLength = InitialGameParameters.TRACK_LENGTH;
    numberOfObstacles = InitialGameParameters.NUMBER_OBSTACLES;
    maxNumberStones = InitialGameParameters.MAX_NUMBER_STONES;
    numberOfStones = InitialGameParameters.NUMBER_STONES;
    speed = InitialGameParameters.SPEED;
    countdownTime = InitialGameParameters.COUNTDOWN_TIME; //should be 1 second more than client - TODO: make sure it is
    cameraSpeed = InitialGameParameters.CAMERA_SPEED;
    chasersSpeed = InitialGameParameters.CHASERS_SPEED;
    stunnedTime = InitialGameParameters.STUNNED_TIME;

    initialPlayerPositionX = InitialGameParameters.PLAYERS_POSITION_X;
    chasersPositionX = InitialGameParameters.CHASERS_POSITION_X;
    cameraPositionX = InitialGameParameters.CAMERA_POSITION_X;

    constructor(roomId: string, public leaderboard: Leaderboard /*, public usingChasers = false*/) {
        super(roomId);
    }

    protected mapUserToPlayer(user: User) {
        const player = new CatchFoodPlayer(
            user.id,
            user.name,
            this.initialPlayerPositionX,
            createObstacles(
                getObstacleTypes(this.numberOfObstacles),
                this.numberOfObstacles,
                this.trackLength,
                this.initialPlayerPositionX
            ),
            user.characterNumber
        );

        player.on(CatchFoodPlayer.EVT_UNSTUNNED, () => {
            this.onPlayerUnstunned(player.id);
        });

        return player;
    }
    protected postProcessPlayers(playersIterable: IterableIterator<CatchFoodPlayer>) {
        const players = Array.from(playersIterable);
        const obstacles: Obstacle[] = [];
        players.forEach(player => obstacles.push(...player.obstacles));
        const stones = getStonesForObstacles(
            obstacles,
            this.trackLength,
            this.initialPlayerPositionX,
            100,
            this.numberOfStones
        );

        for (const player of players) {
            player.obstacles = sortBy([...player.obstacles, ...stones], 'positionX');
        }
    }

    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.cameraPositionX < this.trackLength)
            this.cameraPositionX += (timeElapsedSinceLastFrame / 33) * this.cameraSpeed;

        // console.log(this.cameraPositionX);
        this.updateChasersPosition(timeElapsed, timeElapsedSinceLastFrame);
        // console.log(this.chasersPositionX);
        // console.log('------------------------------------');

        if (localDevelopment) {
            for (const player of this.players.values()) {
                if (player.positionX < this.trackLength) {
                    this.runForward(player.id, ((this.speed / 10) * timeElapsedSinceLastFrame) / 1);
                }
            }
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
            case CatchFoodMsgType.OBSTACLE_SKIPPED:
                this.playerHasSkippedObstacle(message.userId!, (message as IMessageObstacle).obstacleId);
                break;
            case CatchFoodMsgType.STUN_PLAYER:
                if (!message.receivingUserId) {
                    break;
                }
                this.stunPlayer(message.receivingUserId, message.userId!, message.usingCollectedStone || false);
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
        this.initialPlayerPositionX = InitialGameParameters.PLAYERS_POSITION_X;
        this.chasersPositionX = InitialGameParameters.CHASERS_POSITION_X;
        this.cameraPositionX = InitialGameParameters.CAMERA_POSITION_X;

        super.createNewGame(users);

        const firstGameStateInfo = this.getGameStateInfo();
        CatchFoodGameEventEmitter.emitInitialGameStateInfoUpdate({
            roomId: this.roomId,
            gameStateInfo: {
                roomId: firstGameStateInfo.roomId,
                trackLength: this.trackLength,
                numberOfObstacles: this.numberOfObstacles,
                playersState: firstGameStateInfo.playersState,
                gameState: firstGameStateInfo.gameState,
                chasersPositionX: firstGameStateInfo.chasersPositionX,
                cameraPositionX: firstGameStateInfo.cameraPositionX,
            },
        });
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
                canSkipObstacle: player.canSkipObstacle,
                finished: player.finished,
                finishedTimeMs: player.finishedTimeMs,
                dead: player.dead,
                rank: player.rank,
                isActive: player.isActive,
                stunned: player.stunned,
                characterNumber: player.characterNumber,
                numberStonesThrown: player.numberStonesThrown,
            })),
            chasersPositionX: this.chasersPositionX,
            cameraPositionX: this.cameraPositionX,
        };
    }

    //TODO test
    private updateChasersPosition(timeElapsed: number, timeElapsedSinceLastFrame: number) {
        //10000 to 90000  * timePassed //TODO - make faster over time??
        if (this.chasersPositionX > this.trackLength) return;
        this.chasersPositionX += (timeElapsedSinceLastFrame / 33) * this.chasersSpeed;

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

    private runForward(userId: string, speed = this.speed): void {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userId);
        verifyUserIsActive(userId, this.players.get(userId)!.isActive);

        const player = this.players.get(userId)!;
        if (this.playerIsNotAllowedToRun(userId) || player.stunned) return;

        // player.positionX += Math.abs(speed);
        player.positionX += speed;

        if (this.playerHasReachedObstacle(userId)) this.handlePlayerReachedObstacle(userId);
        if (this.playerHasPassedGoal(userId)) this.playerHasFinishedGame(userId);
    }

    private playerIsNotAllowedToRun(userId: string) {
        const player = this.players.get(userId)!;

        return player.finished || player.dead || player.atObstacle;
    }

    private playerHasReachedObstacle(userId: string): boolean {
        const player = this.players.get(userId);

        return (
            (player?.obstacles?.length || 0) > 0 && (player?.positionX || 0) >= (player?.obstacles?.[0]?.positionX || 0)
        );
    }

    private playerHasPassedGoal(userId: string): boolean {
        const player = this.players.get(userId)!;

        return player.positionX >= this.trackLength && player.obstacles.length === 0;
    }

    private handlePlayerReachedObstacle(userId: string): void {
        const player = this.players.get(userId)!;

        // when already carrying a stone automatically skip the stone obstacle
        if (player.obstacles[0].type === ObstacleType.Stone && player.stonesCarrying > 0) {
            player.obstacles.shift();
            return;
        }

        // block player from running when obstacle is reached
        player.atObstacle = true;
        player.canSkipObstacle = player.obstacles[0].skippable;

        //set position x to obstacle position (in case ran past)
        player.positionX = player.obstacles[0].positionX;
        const obstacleDetails: ObstacleReachedInfoController = {
            obstacleType: player.obstacles[0].type,
            obstacleId: player.obstacles[0].id,
        };
        if (player.obstacles[0].type === ObstacleType.Trash) {
            obstacleDetails.trashType = player.obstacles[0].trashType;
            obstacleDetails.numberTrashItems = player.obstacles[0].numberTrashItems;
        }

        CatchFoodGameEventEmitter.emitObstacleReachedEvent({
            roomId: this.roomId,
            userId,
            ...obstacleDetails,
        });
    }

    private stunPlayer(userIdStunned: string, userIdThrown: string, usingCollectedStone = false) {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userIdStunned);
        verifyUserId(this.players, userIdThrown);
        verifyUserIsActive(userIdStunned, this.players.get(userIdStunned)!.isActive);

        const playerThrown = this.players.get(userIdThrown)!;

        if (usingCollectedStone) {
            this.verifyUserCanThrowCollectedStone(playerThrown);
        }

        const playerStunned = this.players.get(userIdStunned)!;
        if (this.playerIsNotAllowedToRun(userIdStunned)) return;
        if (playerStunned.stunned || playerStunned.atObstacle) return;
        if (!usingCollectedStone && playerThrown.numberStonesThrown >= this.maxNumberStones) return;
        if (usingCollectedStone) {
            playerThrown.stonesCarrying--;
        } else {
            playerThrown.numberStonesThrown++;
        }
        playerStunned.stunned = true;
        playerStunned.stunnedSeconds = this.stunnedTime;

        CatchFoodGameEventEmitter.emitPlayerIsStunned({
            roomId: this.roomId,
            userId: userIdStunned,
        });
    }

    //TODO test & move to player
    private onPlayerUnstunned(userId: string) {
        CatchFoodGameEventEmitter.emitPlayerIsUnstunned({
            roomId: this.roomId,
            userId: userId,
        });
    }

    private playerHasSkippedObstacle(userId: string, obstacleId: number): void {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userId);
        verifyUserIsActive(userId, this.players.get(userId)!.isActive);

        this.verifyUserCanSkipObstacle(userId);

        const player = this.players.get(userId)!;

        if (player.obstacles[0].id === obstacleId) {
            player.atObstacle = false;
            player.canSkipObstacle = false;

            player.obstacles.shift();
        } else {
            throw new WrongObstacleIdError(`${obstacleId} is not the id for the next obstacle.`, userId, obstacleId);
        }
    }

    private playerHasCompletedObstacle(userId: string, obstacleId: number): void {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userId);
        verifyUserIsActive(userId, this.players.get(userId)!.isActive);

        this.verifyUserIsAtObstacle(userId);

        const player = this.players.get(userId)!;

        if (player.obstacles[0].id === obstacleId) {
            player.atObstacle = false;
            player.canSkipObstacle = false;

            if (player.obstacles[0].type === ObstacleType.Stone) {
                player.stonesCarrying++;
            }

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

    private verifyUserCanSkipObstacle(userId: string) {
        this.verifyUserIsAtObstacle(userId);

        const player = this.players.get(userId)!;

        if (!player.canSkipObstacle) {
            throw new ObstacleNotSkippable(undefined, userId, player.obstacles[0].id);
        }
    }

    private verifyUserCanThrowCollectedStone(userId: string | CatchFoodPlayer) {
        const player = typeof userId === 'string' ? this.players.get(userId)! : userId;

        if (player.stonesCarrying < 1) {
            throw new UserHasNoStones(undefined, player.id);
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
