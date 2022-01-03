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
import Chasers from './classes/Chasers';
import UserHasNoStones from './customErrors/UserHasNoStones';
import { GameOneMsgType, ObstacleType } from './enums';
import GameOneEventEmitter from './GameOneEventEmitter';
import * as InitialGameParameters from './GameOneInitialParameters';
import GameOnePlayer from './GameOnePlayer';
import {
    createObstacles, getObstacleTypes, getStonesForObstacles, sortBy
} from './helperFunctions/initiatePlayerState';
import { GameStateInfo, Obstacle, ObstacleTypeObject, PlayerRank } from './interfaces';
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
    numberOfStones = InitialGameParameters.NUMBER_STONES;
    speed = InitialGameParameters.SPEED;
    countdownTime = InitialGameParameters.COUNTDOWN_TIME; //should be 1 second more than client - TODO: make sure it is
    cameraSpeed = InitialGameParameters.CAMERA_SPEED;
    initialPlayerPositionX = InitialGameParameters.PLAYERS_POSITION_X;
    cameraPositionX = InitialGameParameters.CAMERA_POSITION_X;
    obstacleTypes: ObstacleTypeObject[] = [];
    gameName = GameNames.GAME1;
    chasers?: Chasers;

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

        this.chasers!.update(timeElapsed, timeElapsedSinceLastFrame);
        this.checkIfPlayersCaught();

        if (localDevelopment) {
            this.updateLocalDev();
        }
    }

    protected handleInput(message: IMessage) {
        switch (message.type) {
            case GameOneMsgType.MOVE:
                this.movePlayer(message);

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

    private movePlayer(message: IMessage) {
        verifyGameState(this.gameState, [GameState.Started]);
        if (!this.players.has(message.userId!)) return;
        const player = this.players.get(message.userId!)!;
        player.runForward(parseInt(`${process.env.SPEED}`, 10) || 2);
        if (player.playerHasPassedGoal()) {
            this.handlePlayerFinished(player);
        }
    }

    private handlePlayerFinished(player: GameOnePlayer) {
        const finishedTime = Date.now();
        player.handlePlayerFinishedGame(finishedTime, this.rankSuccessfulUser(finishedTime));
        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.getStunnablePlayers());
        const playersNotFinished = Array.from(this.players.values()).filter(player => !player.finished);

        // when there is only one player left the stone obstacles are removed as they do not serve a purpose at that point
        if (playersNotFinished.length <= 1) {
            for (const player of playersNotFinished) {
                player.obstacles = player.obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
            }
        }

        if (this.gameHasFinished()) this.handleGameFinished();
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
        this.cameraPositionX = InitialGameParameters.CAMERA_POSITION_X;
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
            chasersPositionX: this.chasers!.getPosition(),
            cameraPositionX: this.cameraPositionX,
        };
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
        this.players.get(playerState.id)?.updatePlayerStateFinished();
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
        return player.positionX <= this.chasers!.getPosition();
    }

    getObstaclePositions(): HashTable<Array<Obstacle>> {
        const obstaclePositions: HashTable<Array<Obstacle>> = {};
        for (const player of this.players.values()) {
            obstaclePositions[player.id] = [...player.obstacles];
        }

        return obstaclePositions;
    }

    private stunPlayer(userIdStunned: string, userIdThrown: string) {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userIdStunned);
        verifyUserId(this.players, userIdThrown);
        verifyUserIsActive(userIdStunned, this.players.get(userIdStunned)!.isActive);

        const playerThrown = this.players.get(userIdThrown)!;
        const player = typeof playerThrown === 'string' ? this.players.get(playerThrown)! : playerThrown;
        player.verifyUserCanThrowCollectedStone();
        playerThrown.stonesCarrying--;

        this.players.get(userIdStunned)!.stun();
    }

    private pushChasers(userIdPushing: string) {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.players, userIdPushing);

        const userPushing = this.players.get(userIdPushing)!;
        if (!userPushing.finished || userPushing.maxNumberPushChasersExceeded()) return;

        userPushing.pushChasers();
        this.chasers?.push();
        this.checkIfPlayersCaught();
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
        const player = this.players.get(userId)!;
        verifyUserIsActive(userId, player.isActive);
        player.obstacleCompleted(obstacleId);
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

    //*****************

    private updateLocalDev() {
        for (const player of this.players.values()) {
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
