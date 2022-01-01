import { localDevelopment, pushChasers } from '../../../constants';
import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
import { GameState } from '../enums';
import Game from '../Game';
import { verifyGameState } from '../helperFunctions/verifyGameState';
import { verifyUserId } from '../helperFunctions/verifyUserId';
import { verifyUserIsActive } from '../helperFunctions/verifyUserIsActive';
import { HashTable, IGameInterface } from '../interfaces';
import { GameType } from '../leaderboard/enums/GameType';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import { NotAtObstacleError, WrongObstacleIdError } from './customErrors';
import UserHasNoStones from './customErrors/UserHasNoStones';
import { GameOneMsgType, ObstacleType } from './enums';
import GameOneEventEmitter from './GameOneEventEmitter';
import * as InitialGameParameters from './GameOneInitialParameters';
import GameOnePlayer from './GameOnePlayer';
import {
    createObstacles, getObstacleTypes, getStonesForObstacles, sortBy
} from './helperFunctions/initiatePlayerState';
import { GameStateInfo, Obstacle, ObstacleTypeObject, PlayerRank } from './interfaces';
import { ObstacleReachedInfoController } from './interfaces/GameEvents';
import { IMessageObstacle } from './interfaces/messageObstacle';
import { IMessageStunPlayer } from './interfaces/messageStunPlayer';

let pushChasersPeriodicallyCounter = 0; // only for testing TODO delete

interface GameOneInterface extends IGameInterface<GameOnePlayer, GameStateInfo> {
    trackLength: number;
    numberOfObstacles: number;
    obstacleTypes: ObstacleTypeObject[];

    createNewGame(players: Array<User>, trackLength?: number, numberOfObstacles?: number): void;
    getGameStateInfo(): GameStateInfo;
    getObstaclePositions(): HashTable<Array<Obstacle>>;
}

export default class GameOne extends Game<GameOnePlayer, GameStateInfo> implements GameOneInterface {
    trackLength = InitialGameParameters.TRACK_LENGTH;
    numberOfObstacles = InitialGameParameters.NUMBER_OBSTACLES;
    maxNumberOfChaserPushes = InitialGameParameters.MAX_NUMBER_CHASER_PUSHES;
    chaserPushAmount = InitialGameParameters.CHASER_PUSH_AMOUNT;
    numberOfStones = InitialGameParameters.NUMBER_STONES;
    speed = InitialGameParameters.SPEED;
    countdownTime = InitialGameParameters.COUNTDOWN_TIME; //should be 1 second more than client - TODO: make sure it is
    cameraSpeed = InitialGameParameters.CAMERA_SPEED;
    chasersSpeed = InitialGameParameters.CHASERS_SPEED;
    stunnedTime = InitialGameParameters.STUNNED_TIME;
    approachSolvableObstacleDistance = InitialGameParameters.APPROACH_SOLVABLE_OBSTACLE_DISTANCE;

    initialPlayerPositionX = InitialGameParameters.PLAYERS_POSITION_X;
    chasersPositionX = InitialGameParameters.CHASERS_POSITION_X;
    cameraPositionX = InitialGameParameters.CAMERA_POSITION_X;
    obstacleTypes: ObstacleTypeObject[] = [];
    maxRunsPerFrame = 1;

    gameName = GameNames.GAME1;

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
            user.characterNumber
        );

        player.on(GameOnePlayer.EVT_UNSTUNNED, () => {
            this.onPlayerUnstunned(player.id);
        });

        return player;
    }

    protected postProcessPlayers(playersIterable: IterableIterator<GameOnePlayer>) {
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
            player.obstacles = sortBy([...player.obstacles, ...stones.map(stone => ({ ...stone }))], 'positionX');
        }
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.cameraPositionX < this.trackLength)
            this.cameraPositionX += (timeElapsedSinceLastFrame / 33) * this.cameraSpeed;

        this.updateChasersPosition(timeElapsedSinceLastFrame);

        if (localDevelopment) {
            for (const player of this.players.values()) {
                if (player.positionX < this.trackLength) {
                    for (let i = 0; i < 5; i++) {
                        // to test speed limit
                        this.runForward(player.id, parseInt(`${process.env.SPEED}`, 10) || 2);
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

    protected handleInput(message: IMessage) {
        switch (message.type) {
            case GameOneMsgType.MOVE:
                this.runForward(message.userId!, parseInt(`${process.env.SPEED}`, 10) || 2);
                break;
            case GameOneMsgType.OBSTACLE_SOLVED:
                this.playerHasCompletedObstacle(message.userId!, (message as IMessageObstacle).obstacleId);
                break;
            case GameOneMsgType.SOLVE_OBSTACLE:
                this.playerWantsToSolveObstacle(message.userId!, (message as IMessageObstacle).obstacleId);
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
        this.initialPlayerPositionX = InitialGameParameters.PLAYERS_POSITION_X;
        this.chasersPositionX = InitialGameParameters.CHASERS_POSITION_X;
        this.cameraPositionX = InitialGameParameters.CAMERA_POSITION_X;

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
        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.getStunnablePlayers()); // TODO test (test all times this emitter is called)
    }

    private getStunnablePlayers(): string[] {
        return Array.from(this.players.values()).reduce((res: string[], option: Player) => {
            if (!option.finished && option.isActive) {
                res.push(option.id);
            }
            return res;
        }, []);
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
                chaserPushesUsed: player.chaserPushesUsed,
            })),
            chasersPositionX: this.chasersPositionX,
            cameraPositionX: this.cameraPositionX,
        };
    }

    private updateChasersPosition(timeElapsedSinceLastFrame: number) {
        //10000 to 90000  * timePassed //TODO - make faster over time??
        if (this.chasersPositionX > this.trackLength) return;
        this.chasersPositionX += (timeElapsedSinceLastFrame / 33) * this.chasersSpeed;

        this.checkIfPlayersCaught();
    }

    private checkIfPlayersCaught() {
        for (const player of this.players.values()) {
            if (!player.finished && this.chaserCaughtPlayer(player)) {
                this.handlePlayerCaught(player);
            }
        }
    }

    private handlePlayerCaught(playerState: GameOnePlayer) {
        playerState.dead = true;
        this.updatePlayerStateFinished(playerState.id);
        playerState.rank = this.rankFailedUser(playerState.finishedTimeMs);
        GameOneEventEmitter.emitPlayerIsDead(this.roomId, playerState.id, playerState.rank);
        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.getStunnablePlayers());

        //todo duplicate
        if (!localDevelopment) {
            const players = Array.from(this.players.values());
            const activeUnfinishedPlayers = players.filter(player => player.isActive && !player.dead);
            if (activeUnfinishedPlayers.length <= 1 || this.gameHasFinished()) {
                this.handleGameFinished();
            }
        }
    }

    private chaserCaughtPlayer(player: GameOnePlayer) {
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
        player.countRunsPerFrame++;

        if (this.playerHasReachedObstacle(userId)) this.handlePlayerReachedObstacle(userId);
        if (this.playerIsApproachingSolvableObstacle(player)) this.handlePlayerApproachingSolvableObstacle(player);
        if (this.playerHasPassedGoal(userId)) this.playerHasFinishedGame(userId);
    }

    private playerIsNotAllowedToRun(userId: string) {
        const player = this.players.get(userId)!;

        return player.finished || player.dead || player.atObstacle || player.countRunsPerFrame >= this.maxRunsPerFrame;
    }

    private playerIsApproachingSolvableObstacle(player: GameOnePlayer): boolean {
        return (
            !player.atObstacle &&
            (player.obstacles.length || 0) > 0 &&
            (player.positionX || 0) >= (player.obstacles[0].positionX || 0) - this.approachSolvableObstacleDistance &&
            player.obstacles[0].solvable
        );
    }

    private playerHasReachedObstacle(userId: string): boolean {
        const player = this.players.get(userId);

        return (
            (player?.obstacles?.length || 0) > 0 &&
            !!player?.positionX &&
            !!player?.obstacles?.[0]?.positionX &&
            player.positionX >= player.obstacles[0].positionX
        );
    }

    private playerHasPassedGoal(userId: string): boolean {
        const player = this.players.get(userId)!;

        return player.positionX >= this.trackLength && player.obstacles.length === 0;
    }

    private handlePlayerApproachingSolvableObstacle(player: GameOnePlayer): void {
        // when already carrying a stone, no action is required
        if (player.obstacles[0].type === ObstacleType.Stone && player.stonesCarrying > 0) {
            return;
        }

        if (!player.obstacles[0].sentApproachingMessage) {
            player.obstacles[0].sentApproachingMessage = true;
            GameOneEventEmitter.emitApproachingSolvableObstacleEventOnce({
                roomId: this.roomId,
                userId: player.id,
                obstacleType: player.obstacles[0].type,
                obstacleId: player.obstacles[0].id,
                distance: player.obstacles[0].positionX - player.positionX,
            });
        }

        GameOneEventEmitter.emitApproachingSolvableObstacleEvent({
            roomId: this.roomId,
            userId: player.id,
            obstacleType: player.obstacles[0].type,
            obstacleId: player.obstacles[0].id,
            distance: player.obstacles[0].positionX - player.positionX,
        });
    }

    private handlePlayerReachedObstacle(userId: string): void {
        const player = this.players.get(userId)!;
        //reset sentApproachingMessage for next optional obstacle
        player.obstacles[0].sentApproachingMessage = false;
        // when already carrying a stone or not opt in automatically skip the stone obstacle
        if (
            (player.obstacles[0].type === ObstacleType.Stone && player.stonesCarrying > 0) ||
            player.obstacles[0].solvable
        ) {
            player.obstacles.shift();
            GameOneEventEmitter.emitObstacleSkippedEvent({
                roomId: this.roomId,
                userId,
            });
            return;
        }

        // block player from running when obstacle is reached
        player.atObstacle = true;

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

        GameOneEventEmitter.emitObstacleReachedEvent({
            roomId: this.roomId,
            userId,
            ...obstacleDetails,
        });
    }

    private stunPlayer(userIdStunned: string, userIdThrown: string) {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userIdStunned);
        verifyUserId(this.players, userIdThrown);
        verifyUserIsActive(userIdStunned, this.players.get(userIdStunned)!.isActive);

        const playerThrown = this.players.get(userIdThrown)!;

        this.verifyUserCanThrowCollectedStone(playerThrown);
        playerThrown.stonesCarrying--;

        const playerStunned = this.players.get(userIdStunned)!;
        if (this.playerIsNotAllowedToRun(userIdStunned)) return;
        if (playerStunned.stunned || playerStunned.atObstacle) return;
        playerStunned.stunned = true;
        playerStunned.stunnedSeconds = this.stunnedTime;

        GameOneEventEmitter.emitPlayerIsStunned(this.roomId, userIdStunned);
    }

    private pushChasers(userIdPushing: string) {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userIdPushing);

        const userPushing = this.players.get(userIdPushing)!;
        if (!pushChasers) if (!userPushing.finished) return;
        if (this.maxNumberPushChasersExceeded(userPushing)) return;

        //TODO Test
        this.chasersPositionX += this.chaserPushAmount;
        this.chasersSpeed = InitialGameParameters.CHASERS_PUSH_SPEED;
        setTimeout(() => {
            this.chasersSpeed = InitialGameParameters.CHASERS_SPEED;
        }, 1300);
        userPushing.chaserPushesUsed++;

        if (this.maxNumberPushChasersExceeded(userPushing)) {
            GameOneEventEmitter.emitPlayerHasExceededMaxNumberChaserPushes(this.roomId, userPushing.id);
        }

        this.checkIfPlayersCaught();

        GameOneEventEmitter.emitChasersWerePushed(this.roomId, this.chaserPushAmount);
    }

    private maxNumberPushChasersExceeded(player: GameOnePlayer) {
        return player.chaserPushesUsed >= this.maxNumberOfChaserPushes;
    }

    //TODO test & move to player
    private onPlayerUnstunned(userId: string) {
        GameOneEventEmitter.emitPlayerIsUnstunned(this.roomId, userId);
    }

    private playerWantsToSolveObstacle(userId: string, obstacleId: number): void {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userId);
        verifyUserIsActive(userId, this.players.get(userId)!.isActive);

        const player = this.players.get(userId)!;
        const obstacle = player.obstacles.find(obstacle => obstacle.id === obstacleId);

        if (!obstacle) return;

        obstacle.solvable = false;
        GameOneEventEmitter.emitPlayerWantsToSolveObstacle({ roomId: this.roomId, userId });
    }

    private playerHasCompletedObstacle(userId: string, obstacleId: number): void {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userId);
        verifyUserIsActive(userId, this.players.get(userId)!.isActive);

        this.verifyUserIsAtObstacle(userId);

        const player = this.players.get(userId)!;

        if (player.obstacles[0].id === obstacleId) {
            player.atObstacle = false;

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
        const solvableObstacleInReach = player && this.playerIsApproachingSolvableObstacle(player!);

        if (
            !player?.atObstacle &&
            !solvableObstacleInReach
            // ||
            // player?.positionX !== player?.obstacles?.[0]?.positionX
        ) {
            throw new NotAtObstacleError(`User ${userId} is not at an obstacle`, userId);
        }
    }

    private verifyUserCanThrowCollectedStone(userId: string | GameOnePlayer) {
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

        GameOneEventEmitter.emitPlayerHasFinishedEvent(this.roomId, userId, player.rank);
        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.getStunnablePlayers());

        if (this.gameHasFinished()) {
            this.handleGameFinished();
        }
    }

    private updatePlayerStateFinished(userId: string) {
        const player = this.players.get(userId)!;
        player.finished = true;
        player.finishedTimeMs = Date.now();

        const playersNotFinished = Array.from(this.players.values()).filter(player => !player.finished);

        // when there is only one player left the stone obstacles are removed as they do not serve a purpose at that point
        if (playersNotFinished.length <= 1) {
            for (const player of playersNotFinished) {
                player.obstacles = player.obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
            }
        }
    }

    private gameHasFinished(): boolean {
        const players = Array.from(this.players.values());
        const activeUnfinishedPlayers = players.filter(player => player.isActive && !player.finished);

        return activeUnfinishedPlayers.length === 0;
    }

    private handleGameFinished(): void {
        this.gameState = GameState.Finished;

        const playerRanks = this.createPlayerRanks();
        this.leaderboard.addGameToHistory(GameType.GameOne, [...playerRanks]);

        const currentGameStateInfo = this.getGameStateInfo();
        GameOneEventEmitter.emitGameHasFinishedEvent(currentGameStateInfo.roomId, currentGameStateInfo.gameState, [
            ...playerRanks,
        ]);
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
            GameOneEventEmitter.emitPlayerHasDisconnected(this.roomId, userId);
            GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.getStunnablePlayers());

            return true;
        }

        return false;
    }

    reconnectPlayer(userId: string) {
        if (super.reconnectPlayer(userId)) {
            GameOneEventEmitter.emitPlayerHasReconnected(this.roomId, userId);
            GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.getStunnablePlayers());
            return true;
        }

        return false;
    }
}
