// import GameEventEmitter from '../../classes/GameEventEmitter';

import { localDevelopment } from '../../../constants';
import User from '../../classes/user';
import { Globals } from '../../enums/globals';
import { MaxNumberUsersExceededError } from '../customErrors';
import { GameState } from '../enums';
import { verifyGameState } from '../helperFunctions/verifyGameState';
import { verifyUserId } from '../helperFunctions/verifyUserId';
import { verifyUserIsActive } from '../helperFunctions/verifyUserIsActive';
import { HashTable, IGameInterface } from '../interfaces';
import { GameType } from '../leaderboard/enums/GameType';
import Leaderboard from '../leaderboard/Leaderboard';
import CatchFoodGameEventEmitter from './CatchFoodGameEventEmitter';
import { NotAtObstacleError, WrongObstacleIdError } from './customErrors';
import { initiatePlayersState } from './helperFunctions/initiatePlayerState';
import {
    GameEvents, GameStateInfo, Obstacle, PlayerRank, PlayerState, PlayerStateForClient
} from './interfaces';

interface CatchFoodGameInterface extends IGameInterface {
    playersState: HashTable<PlayerState>;
    trackLength: number;
    numberOfObstacles: number;

    createNewGame(players: Array<User>, trackLength: number, numberOfObstacles: number): void;
    getGameStateInfo(): GameStateInfo;
    getObstaclePositions(): HashTable<Array<Obstacle>>;
    runForward(userId: string, speed: number): void;
    playerHasCompletedObstacle(userId: string, obstacleId: number): void;
    stunPlayer(userIdStunned: string, userIdThrown: string): void;
}

export default class CatchFoodGame implements CatchFoodGameInterface {
    playersState: HashTable<PlayerState>;
    trackLength: number;
    numberOfObstacles: number;
    speed: number;
    currentRank: number;
    currentRankFromTheBack: number;
    ranksDictionary: HashTable<number>;
    ranksFromTheBackDictionary: HashTable<number>;
    // gameEventEmitter: GameEventEmitter
    roomId: string;
    maxNumberOfPlayers: number;
    gameState: GameState;
    gameStartedTime: number;
    players: Array<User>;
    timeOutLimit: number;
    timer: ReturnType<typeof setTimeout>;
    countdownTime: number;
    timeOutRemainingTime: number;
    gamePausedTime: number;
    leaderboard: Leaderboard;
    timeWhenChasersAppear: number;
    // usingChasers: boolean //TODO try and remove (for tests)
    initialPlayerPositionX: number;
    chasersPositionX: number;
    updateChasersInterval?: ReturnType<typeof setInterval>;
    updateChasersIntervalTime: number;
    chasersAreRunning: boolean;
    cameraPositionX: number;
    cameraSpeed: number;
    maxNumberStones: number;

    constructor(roomId: string, leaderboard: Leaderboard /*, public usingChasers = false*/, public stunnedTime = 3000) {
        // this.gameEventEmitter = CatchFoodGameEventEmitter.getInstance()
        this.roomId = roomId;
        this.maxNumberOfPlayers = Globals.MAX_PLAYER_NUMBER;
        this.gameState = GameState.Initialised;
        this.trackLength = 5000; // TODO 5000;
        this.numberOfObstacles = 4;
        this.speed = 0;
        this.currentRank = 1;
        this.currentRankFromTheBack = 4;
        this.ranksDictionary = {};
        this.ranksFromTheBackDictionary = {};
        this.players = [];
        this.playersState = {};
        this.gameStartedTime = 0;
        this.timeOutLimit = 300000;
        this.timer = setTimeout(() => ({}), 0);
        this.countdownTime = 4000; //should be 1 second more than client - TODO make sure it is
        this.timeOutRemainingTime = 0;
        this.gamePausedTime = 0;
        // this.leaderboard = {};
        this.leaderboard = leaderboard;
        this.timeWhenChasersAppear = 25000; //10 sec
        this.initialPlayerPositionX = 500;
        this.chasersPositionX = 0;
        this.updateChasersInterval = undefined;
        this.updateChasersIntervalTime = 100;
        this.chasersAreRunning = false;
        this.cameraPositionX = 0;
        this.cameraSpeed = 1.7;
        this.maxNumberStones = 5;
    }

    createNewGame(
        players: Array<User>,
        trackLength = this.trackLength,
        numberOfObstacles = this.numberOfObstacles,
        speed = 2
    ): void {
        verifyGameState(this.gameState, [GameState.Initialised, GameState.Finished, GameState.Stopped]);
        if (players.length > this.maxNumberOfPlayers) {
            throw new MaxNumberUsersExceededError(
                `Too many players. Max ${this.maxNumberOfPlayers} Players`,
                this.maxNumberOfPlayers
            );
        }
        this.gameState = GameState.Created;
        this.trackLength = trackLength;
        this.players = players;
        this.currentRank = 1;
        this.currentRankFromTheBack = players.length;
        this.gameStartedTime = 0;
        this.chasersAreRunning = false;
        this.numberOfObstacles = numberOfObstacles;
        this.playersState = initiatePlayersState(
            players,
            this.numberOfObstacles,
            this.trackLength,
            this.initialPlayerPositionX
        );
        clearTimeout(this.timer);
        if (this.updateChasersInterval) clearInterval(this.updateChasersInterval);
        this.startGame();
        this.speed = speed;
        this.chasersPositionX = 1350;
        // this.chasersPositionX = (6 * this.speed * this.timeWhenChasersAppear) / 100; //(6 updates per 100ms)
    }

    //put together
    private startGame(): void {
        setTimeout(() => {
            this.gameState = GameState.Started;
            this.gameStartedTime = Date.now();
            // setInterval(this.onTimerTick, 33);
            this.updateChasersInterval = setInterval(() => {
                this.updateChasersPosition();
            }, this.updateChasersIntervalTime);
            //TODO delete

            if (localDevelopment && this.gameState === GameState.Started) {
                const keys = Object.keys(this.playersState);
                // let done = false;
                keys.forEach(key => {
                    // if (!done) {
                    // done = true;
                    const runInterval = setInterval(() => {
                        // console.log(this.playersState[key].positionX);
                        // this.playersState[key].positionX += this.speed;
                        this.runForward(key, this.speed);
                        if (this.playersState[key].positionX >= this.trackLength) {
                            console.log('at goal');
                            clearInterval(runInterval);
                        }
                    }, 18); //make a bit slower - real players will not have a consistent rate
                    // }, 16.6667);
                    // }
                });
            }
        }, this.countdownTime);
        this.timer = setTimeout(() => {
            this.stopGameTimeout();
        }, this.timeOutLimit);

        //TODO
        // setTimeout(() => {

        // }, this.countdownTime + this.timeWhenChasersAppear);

        CatchFoodGameEventEmitter.emitGameHasStartedEvent({
            roomId: this.roomId,
            countdownTime: this.countdownTime,
        });
    }

    // private onTimerTick() {
    //   // console.log(Date.now() - this.gameStartedTime)
    //   if (Date.now() - this.gameStartedTime > this.timeOutLimit) {
    //     //300000ms = 5 min
    //   }
    // }

    pauseGame(): void {
        verifyGameState(this.gameState, [GameState.Started]);
        this.gameState = GameState.Paused;

        // update gamePausedTime
        this.gamePausedTime = Date.now();

        // pause timeout timer
        clearTimeout(this.timer);
        // console.log(this.updateChasersInterval);
        if (this.updateChasersInterval) {
            // console.log('CLEARING INTERVAL');
            clearInterval(this.updateChasersInterval);
        }
        this.timeOutRemainingTime = this.timeOutLimit - this.getGameTimePassedBeforePause();

        //stop stunned timeouts
        for (const [, playerState] of Object.entries(this.playersState)) {
            if (playerState.stunned) {
                if (playerState.stunnedTimeout) clearTimeout(playerState.stunnedTimeout);
            }
        }

        CatchFoodGameEventEmitter.emitGameHasPausedEvent({ roomId: this.roomId });

        //TODO UPDATE STUNNED TIME!!
    }

    private getGameTimePassedBeforePause(): number {
        return this.gamePausedTime - this.gameStartedTime;
    }

    resumeGame(): void {
        verifyGameState(this.gameState, [GameState.Paused]);
        this.gameState = GameState.Started;

        // resume timeout timer
        this.timer = setTimeout(() => {
            this.stopGameTimeout();
        }, this.timeOutRemainingTime);

        this.updateChasersInterval = setInterval(() => {
            this.updateChasersPosition();
        }, this.updateChasersIntervalTime);

        //update gameStartedTime
        this.gameStartedTime = Date.now() - this.getGameTimePassedBeforePause();

        //update stunned time
        for (const [, playerState] of Object.entries(this.playersState)) {
            if (playerState.stunned) {
                const stunnedTimeAlreadyPassed = this.gamePausedTime - playerState.timeWhenStunned;
                // playerState.timeWhenStunned = Date.now() - stunnedTimeAlreadyPassed;

                //TODO extract setting timeouts
                playerState.stunnedTimeout = setTimeout(() => {
                    this.unstunPlayer(playerState.id);
                }, this.stunnedTime - stunnedTimeAlreadyPassed);
            }
        }

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
        this.stopGame();
        clearTimeout(this.timer);
        CatchFoodGameEventEmitter.emitGameHasStoppedEvent({ roomId: this.roomId });
    }

    stopGameAllUsersDisconnected() {
        this.stopGame();
        clearTimeout(this.timer);
        CatchFoodGameEventEmitter.emitAllPlayersHaveDisconnected({ roomId: this.roomId });
    }

    private stopGame(): void {
        if (this.updateChasersInterval) clearInterval(this.updateChasersInterval);
        verifyGameState(this.gameState, [GameState.Started, GameState.Paused]);
        this.gameState = GameState.Stopped;
    }

    getGameStateInfo(): GameStateInfo {
        const playerInfoArray: PlayerStateForClient[] = [];

        //TODO reduce down to PlayerStateForClient some prettier way & make sure that PlayerState type is not accepted!!
        for (const [, playerState] of Object.entries(this.playersState)) {
            playerInfoArray.push({
                id: playerState.id,
                name: playerState.name,
                positionX: playerState.positionX,
                obstacles: playerState.obstacles,
                atObstacle: playerState.atObstacle,
                finished: playerState.finished,
                finishedTimeMs: playerState.finishedTimeMs,
                dead: playerState.dead,
                rank: playerState.rank,
                isActive: playerState.isActive,
                stunned: playerState.stunned,
                characterNumber: playerState.characterNumber,
                numberStonesThrown: playerState.numberStonesThrown,
            });
        }

        //TODO - change when main loop - don't send any gamestate info until countdown stopped
        if (this.gameState === GameState.Started) {
            this.cameraPositionX += this.cameraSpeed;
        }

        return {
            gameState: this.gameState,
            roomId: this.roomId,
            playersState: [...playerInfoArray],
            trackLength: this.trackLength,
            numberOfObstacles: this.numberOfObstacles,
            chasersPositionX: this.chasersPositionX,
            chasersAreRunning: this.chasersAreRunning,
            cameraPositionX: this.cameraPositionX,
        };
    }

    //TODO test (and the intervals)
    private updateChasersPosition(): void {
        //TODO
        const timePassed = Date.now() - this.gameStartedTime;

        //10000 to 90000  * timePassed //TODO - make faster over time??
        if (timePassed < this.timeWhenChasersAppear) return;
        // console.log('PLAYER POS: ', this.playersState);
        if (!this.chasersAreRunning) this.chasersAreRunning = true;
        this.chasersPositionX += this.cameraSpeed * 3;

        // console.log('here---' + this.chasersPositionX);

        //TODO test
        for (const [, playerState] of Object.entries(this.playersState)) {
            if (!playerState.finished && this.chaserCaughtPlayer(playerState)) {
                this.handlePlayerCaught(playerState);
            }
        }
    }

    private handlePlayerCaught(playerState: PlayerState) {
        playerState.dead = true;
        this.updatePlayerStateFinished(playerState.id);
        playerState.rank = this.getRankFromTheBack(playerState.finishedTimeMs);
        CatchFoodGameEventEmitter.emitPlayerIsDead({
            roomId: this.roomId,
            userId: playerState.id,
            rank: playerState.rank,
        });
        //todo duplicate
        if (!localDevelopment) {
            const userIds = Object.keys(this.playersState);
            const activeUnfinishedPlayers = userIds.filter(userId => {
                if (this.playersState[userId].isActive && !this.playersState[userId].dead) return userId;
            });
            if (activeUnfinishedPlayers.length <= 1 || this.gameHasFinished()) {
                this.handleGameFinished();
            }
        }
    }

    private chaserCaughtPlayer(playerState: PlayerState) {
        return playerState.positionX <= this.chasersPositionX;
    }

    getObstaclePositions(): HashTable<Array<Obstacle>> {
        const obstaclePositions: HashTable<Array<Obstacle>> = {};
        for (const [, playerState] of Object.entries(this.playersState)) {
            obstaclePositions[playerState.id] = [...playerState.obstacles];
        }

        return { ...obstaclePositions };
    }

    runForward(userId: string, speed = 1): void {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.playersState, userId);
        verifyUserIsActive(userId, this.playersState[userId].isActive);

        if (this.userIsNotAllowedToRun(userId) || this.playersState[userId].stunned) return;

        // if (this.playersState[userId].stunned) {
        //     if (this.stunnedTimeIsOver(userId)) {
        //         this.playersState[userId].stunned = false;
        //     } else {
        //         return;
        //     }
        // }

        this.playersState[userId].positionX += Math.abs(speed);

        if (this.playerHasReachedObstacle(userId)) this.handlePlayerReachedObstacle(userId);
        if (this.playerHasPassedGoal(userId)) this.playerHasFinishedGame(userId);
    }

    private userIsNotAllowedToRun(userId: string) {
        return (
            this.playersState[userId].finished || this.playersState[userId].dead || this.playersState[userId].atObstacle
        );
    }

    // private stunnedTimeIsOver(userId: string) {
    //     return Date.now() - this.playersState[userId].timeWhenStunned >= this.stunnedTime;
    // }

    private playerHasReachedObstacle(userId: string): boolean {
        return (
            this.playersState[userId].obstacles.length > 0 &&
            this.playersState[userId].positionX >= this.playersState[userId].obstacles[0].positionX
        );
    }

    private playerHasPassedGoal(userId: string): boolean {
        return (
            this.playersState[userId].positionX >= this.trackLength && this.playersState[userId].obstacles.length === 0
        );
    }

    private handlePlayerReachedObstacle(userId: string): void {
        // block player from running when obstacle is reached
        // console.log('at obstacle');
        this.playersState[userId].atObstacle = true;

        //set position x to obstacle position (in case ran past)
        this.playersState[userId].positionX = this.playersState[userId].obstacles[0].positionX;
        CatchFoodGameEventEmitter.emitObstacleReachedEvent({
            roomId: this.roomId,
            userId,
            obstacleType: this.playersState[userId].obstacles[0].type,
            obstacleId: this.playersState[userId].obstacles[0].id,
        });
    }

    //TODO test
    stunPlayer(userIdStunned: string, userIdThrown: string) {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.playersState, userIdStunned);
        verifyUserIsActive(userIdStunned, this.playersState[userIdStunned].isActive);
        if (this.userIsNotAllowedToRun(userIdStunned)) return;
        if (this.playersState[userIdStunned].stunned || this.playersState[userIdStunned].atObstacle) return;
        if (this.playersState[userIdThrown].numberStonesThrown >= this.maxNumberStones) return;
        this.playersState[userIdThrown].numberStonesThrown++;
        this.playersState[userIdStunned].stunned = true;
        this.playersState[userIdStunned].timeWhenStunned = Date.now();
        this.playersState[userIdStunned].stunnedTimeout = setTimeout(() => {
            this.unstunPlayer(userIdStunned);
        }, this.stunnedTime);

        CatchFoodGameEventEmitter.emitPlayerIsStunned({
            roomId: this.roomId,
            userId: userIdStunned,
        });
    }

    //TODO test
    private unstunPlayer(userId: string) {
        this.playersState[userId].stunned = false;
        this.playersState[userId].stunnedTimeout = undefined;

        CatchFoodGameEventEmitter.emitPlayerIsUnstunned({
            roomId: this.roomId,
            userId: userId,
        });
    }

    playerHasCompletedObstacle(userId: string, obstacleId: number): void {
        verifyGameState(this.gameState, [GameState.Started]);
        verifyUserId(this.playersState, userId);
        verifyUserIsActive(userId, this.playersState[userId].isActive);

        this.verifyUserIsAtObstacle(userId);

        this.playersState[userId].atObstacle = false;
        if (this.playersState[userId].obstacles[0].id === obstacleId) {
            this.playersState[userId].obstacles.shift();
        } else {
            throw new WrongObstacleIdError(`${obstacleId} is not the id for the next obstacle.`, userId, obstacleId);
        }
    }

    private verifyUserIsAtObstacle(userId: string) {
        if (
            !this.playersState[userId].atObstacle
            // ||
            // this.playersState[userId].positionX !== this.playersState[userId].obstacles[0].positionX
        ) {
            throw new NotAtObstacleError(`User ${userId} is not at an obstacle`, userId);
        }
    }

    private playerHasFinishedGame(userId: string): void {
        //only if player hasn't already been marked as finished
        // if (this.playersState[userId].finished) return; //don't think I need

        this.updatePlayerStateFinished(userId);
        this.playersState[userId].rank = this.getRank(this.playersState[userId].finishedTimeMs);
        this.playersState[userId].positionX = this.trackLength;

        CatchFoodGameEventEmitter.emitPlayerHasFinishedEvent({
            userId,
            roomId: this.roomId,
            rank: this.playersState[userId].rank,
        });

        if (this.gameHasFinished()) {
            this.handleGameFinished();
        }
    }

    private updatePlayerStateFinished(userId: string) {
        this.playersState[userId].finished = true;
        this.playersState[userId].finishedTimeMs = Date.now();
    }

    private gameHasFinished(): boolean {
        const userIds = Object.keys(this.playersState);
        const activeUnfinishedPlayers = userIds.filter(userId => {
            if (this.playersState[userId].isActive && !this.playersState[userId].finished) return userId;
        });
        return activeUnfinishedPlayers.length === 0;
        // return this.currentRank > activePlayers.length;
    }

    private getRank(timeFinishedInMs: number) {
        const timeFinishedInMsStr: string = timeFinishedInMs.toString();
        //here
        const currentRank = this.currentRank;
        this.currentRank++;

        // if (!playerIsActive) return this.currentRank;

        // if two players finished at the same time
        if (Object.prototype.hasOwnProperty.call(this.ranksDictionary, timeFinishedInMsStr)) {
            return this.ranksDictionary[timeFinishedInMsStr];
        } else {
            this.ranksDictionary[timeFinishedInMsStr] = currentRank;
            return currentRank;
        }
    }

    private getRankFromTheBack(timeFinishedInMs: number) {
        const timeFinishedInMsStr: string = timeFinishedInMs.toString();
        //here
        const currentRank = this.currentRankFromTheBack;
        this.currentRankFromTheBack--;

        // if two players finished at the same time
        if (Object.prototype.hasOwnProperty.call(this.ranksFromTheBackDictionary, timeFinishedInMsStr)) {
            //take a better rank (3 instead of 4)
            const newRank = this.ranksFromTheBackDictionary[timeFinishedInMsStr] - 1;
            this.ranksFromTheBackDictionary[timeFinishedInMsStr] = newRank;
            //update players with the old rank (change them from 4 to 3)
            Object.keys(this.playersState).forEach(userId => {
                if (this.playersState[userId].finishedTimeMs === parseInt(timeFinishedInMsStr))
                    this.playersState[userId].rank = newRank;
            });

            return this.ranksFromTheBackDictionary[timeFinishedInMsStr];
        } else {
            this.ranksFromTheBackDictionary[timeFinishedInMsStr] = currentRank;
            return currentRank;
        }
    }

    private handleGameFinished(): void {
        this.gameState = GameState.Finished;
        clearTimeout(this.timer);
        if (this.updateChasersInterval) clearInterval(this.updateChasersInterval);
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
        const playerRanks: Array<PlayerRank> = [];
        for (const [, playerState] of Object.entries(this.playersState)) {
            //in case player hasn't finished yet
            const playerFinishedTime = playerState.finishedTimeMs > 0 ? playerState.finishedTimeMs : Date.now();

            // console.log(playerFinishedTime)
            // console.log(this.gameStartedTime)
            // let rank = this.currentRank
            // let rank = playerState.rank || this.getRank(playerFinishedTime)

            playerRanks.push({
                id: playerState.id,
                name: playerState.name,
                rank: playerState.finished ? playerState.rank : this.currentRank,
                finished: playerState.finished,
                dead: playerState.dead,
                totalTimeInMs: playerFinishedTime - this.gameStartedTime,
                positionX: playerState.positionX,
                isActive: playerState.isActive,
            });
        }

        return [...playerRanks];
    }

    disconnectPlayer(userId: string): void {
        verifyGameState(this.gameState, [
            GameState.Initialised,
            GameState.Started,
            GameState.Created,
            GameState.Paused,
        ]);
        verifyUserId(this.playersState, userId);
        if (this.playersState[userId].isActive) {
            this.playersState[userId].isActive = false;
            CatchFoodGameEventEmitter.emitPlayerHasDisconnected({
                roomId: this.roomId,
                userId,
            });

            if (this.allPlayersDisconnected()) {
                this.stopGameAllUsersDisconnected();
            }
        }
    }

    private allPlayersDisconnected() {
        for (const [, playerState] of Object.entries(this.playersState)) {
            if (playerState.isActive) {
                return false;
            }
        }
        return true;

        //TODO (?) - finish game when only one player left connected - but not good if player tries to reconnect
        // const userIds = Object.keys(this.playersState);
        // const activeUnfinishedPlayers = userIds.filter(userId => {
        //     if (this.playersState[userId].isActive) return userId;
        // });
    }

    reconnectPlayer(userId: string): void {
        verifyGameState(this.gameState, [
            GameState.Initialised,
            GameState.Started,
            GameState.Created,
            GameState.Paused,
        ]);
        verifyUserId(this.playersState, userId);
        if (!this.playersState[userId].isActive) {
            this.playersState[userId].isActive = true;
            CatchFoodGameEventEmitter.emitPlayerHasReconnected({
                roomId: this.roomId,
                userId,
            });
        }
    }
}
