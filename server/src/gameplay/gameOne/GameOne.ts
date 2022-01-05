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
import InitialParameters from './constants/InitialParameters';
import { GameOneMsgType } from './enums';
import GameOneEventEmitter from './GameOneEventEmitter';
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

        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.getStunnablePlayers()); // TODO test (test all times this emitter is called)
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
                //TODO renive
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

    getObstaclePositions(): HashTable<Array<Obstacle>> {
        const obstaclePositions: HashTable<Array<Obstacle>> = {};
        for (const player of this.players.values()) {
            obstaclePositions[player.id] = [...player.obstacles];
        }

        return obstaclePositions;
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
        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.getStunnablePlayers());

        if (this.gameHasFinished()) this.handleGameFinished();
    }

    private getStunnablePlayers(): string[] {
        return Array.from(this.players.values()).reduce((res: string[], option: Player) => {
            if (!option.finished && option.isActive) {
                res.push(option.id);
            }
            return res;
        }, []);
    }

    private stunPlayer(userIdStunned: string, userIdThrown: string) {
        const playerThrown = this.getValidPlayer(userIdThrown);
        const playerStunned = this.getValidPlayer(userIdStunned);
        playerThrown.throwStone();
        playerStunned.stun();
    }

    // ***** chasers *****
    private checkIfPlayersCaught() {
        for (const player of this.players.values()) {
            if (this.chaserHasCaughtPlayer(player)) {
                this.handlePlayerCaught(player);
            }
        }
    }

    private handlePlayerCaught(playerState: GameOnePlayer) {
        playerState.handlePlayerCaught();
        playerState.rank = this.rankFailedUser(playerState.finishedTimeMs);
        GameOneEventEmitter.emitStunnablePlayers(this.roomId, this.getStunnablePlayers());

        //todo duplicate
        if (localDevelopment) return;
        const players = Array.from(this.players.values());
        const activeUnfinishedPlayers = players.filter(player => player.isActive && !player.dead);
        if (activeUnfinishedPlayers.length <= 1 || this.gameHasFinished()) {
            this.handleGameFinished();
        }
    }

    private chaserHasCaughtPlayer(player: GameOnePlayer) {
        return !player.finished && player.positionX <= this.chasers!.getPosition();
    }

    private pushChasers(userIdPushing: string) {
        verifyUserId(this.players, userIdPushing);
        const userPushing = this.players.get(userIdPushing)!;

        if (!userPushing.finished || userPushing.maxNumberPushChasersExceeded()) return;

        userPushing.pushChasers();
        this.chasers?.push();
        this.checkIfPlayersCaught();
    }

    // ***** game state *****
    private gameHasFinished(): boolean {
        const players = Array.from(this.players.values());
        const activeUnfinishedPlayers = players.filter(player => player.isActive && !player.finished);

        return activeUnfinishedPlayers.length === 0; //TODO - test, does game finish when only 1 player??
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

    private createPlayerRanks(): Array<PlayerRank> {
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

    //******** other *********

    private getValidPlayer(userId: string): GameOnePlayer {
        verifyUserId(this.players, userId);
        const player = this.players.get(userId)!;
        verifyUserIsActive(userId, player.isActive);
        return player;
    }

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
