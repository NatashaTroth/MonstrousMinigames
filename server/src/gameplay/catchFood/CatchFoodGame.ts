// import GameEventEmitter from '../../classes/GameEventEmitter';
import { User } from '../../interfaces/interfaces';
import { verifyGameState } from '../helperFunctions/verifyGameState';
import { verifyUserIsActive } from '../helperFunctions/verifyUserIsActive';
import { GameInterface, GameState, HashTable } from '../interfaces';
import CatchFoodGameEventEmitter from './CatchFoodGameEventEmitter';
import { initiatePlayersState } from './helperFunctions/initiatePlayerState';
import { verifyUserId } from './helperFunctions/verifyUserId';
import { GameEvents, GameStateInfo, Obstacle, PlayerRank, PlayerState } from './interfaces';

interface CatchFoodGameInterface extends GameInterface {
    playersState: HashTable<PlayerState>;
    trackLength: number;
    numberOfObstacles: number;

    createNewGame(players: Array<User>, trackLength: number, numberOfObstacles: number): void;
    getGameStateInfo(): GameStateInfo;
    getObstaclePositions(): HashTable<Array<Obstacle>>;
    runForward(userId: string, speed: number): void;
    playerHasCompletedObstacle(userId: string, obstacleId: number): void;
}

export default class CatchFoodGame implements CatchFoodGameInterface {
    playersState: HashTable<PlayerState>;
    trackLength: number;
    numberOfObstacles: number;
    currentRank: number;
    ranksDictionary: HashTable<number>;
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

    constructor() {
        // this.gameEventEmitter = CatchFoodGameEventEmitter.getInstance()
        this.roomId = '';
        this.maxNumberOfPlayers = 4;
        this.gameState = GameState.Initialised;
        this.trackLength = 2000;
        this.numberOfObstacles = 4;
        this.currentRank = 1;
        this.ranksDictionary = {};
        this.players = [];
        this.playersState = {};
        this.gameStartedTime = 0;
        this.timeOutLimit = 300000;
        this.timer = setTimeout(() => ({}), 0);
        this.countdownTime = 3000;
        this.timeOutRemainingTime = 0;
        this.gamePausedTime = 0;
    }

    createNewGame(
        players: Array<User>,
        trackLength = this.trackLength,
        numberOfObstacles = this.numberOfObstacles
    ): void {
        verifyGameState(this.gameState, [GameState.Initialised, GameState.Finished, GameState.Stopped]);
        if (players.length > this.maxNumberOfPlayers) {
            throw new Error(`Too many players. Max ${this.maxNumberOfPlayers} Players`);
        }

        this.gameState = GameState.Created;
        this.roomId = players[0].roomId;
        this.trackLength = trackLength;
        this.players = players;
        this.currentRank = 1;
        this.gameStartedTime = 0;
        this.numberOfObstacles = numberOfObstacles;
        this.playersState = initiatePlayersState(players, this.numberOfObstacles, this.trackLength);
        clearTimeout(this.timer);
        this.startGame();
    }

    //put together
    private startGame(): void {
        try {
            setTimeout(() => {
                this.gameState = GameState.Started;
            }, this.countdownTime);
            CatchFoodGameEventEmitter.emitGameHasStartedEvent({
                roomId: this.roomId,
                countdownTime: this.countdownTime,
            });
            this.gameStartedTime = Date.now();
            // setInterval(this.onTimerTick, 33);
            this.timer = setTimeout(() => {
                this.stopGame(true);
            }, this.timeOutLimit);
        } catch (e) {
            // throw e.Message;
        }
    }

    // private onTimerTick() {
    //   // console.log(Date.now() - this.gameStartedTime)
    //   if (Date.now() - this.gameStartedTime > this.timeOutLimit) {
    //     //300000ms = 5 min
    //   }
    // }

    pauseGame(): void {
        try {
            verifyGameState(this.gameState, [GameState.Started]);
            this.gameState = GameState.Paused;

            // update gamePausedTime
            this.gamePausedTime = Date.now();

            // pause timeout timer
            clearTimeout(this.timer);
            this.timeOutRemainingTime = this.timeOutLimit - this.getGameTimePassedBeforePause();

            CatchFoodGameEventEmitter.emitGameHasPausedEvent({ roomId: this.roomId });
        } catch (e) {
            //do something
        }
    }

    private getGameTimePassedBeforePause(): number {
        return this.gamePausedTime - this.gameStartedTime;
    }

    resumeGame(): void {
        try {
            verifyGameState(this.gameState, [GameState.Paused]);
            this.gameState = GameState.Started;

            // resume timeout timer
            this.timer = setTimeout(() => {
                this.stopGame(true);
            }, this.timeOutRemainingTime);
            // this.timeOutRemasiningTime = 0

            //update gameStartedTime
            this.gameStartedTime = Date.now() - this.getGameTimePassedBeforePause();

            CatchFoodGameEventEmitter.emitGameHasResumedEvent({ roomId: this.roomId });
        } catch (e) {
            //do something
        }
    }

    stopGame(timeOut = false): void {
        try {
            verifyGameState(this.gameState, [GameState.Started, GameState.Paused]);
            this.gameState = GameState.Stopped;
            const currentGameStateInfo = this.getGameStateInfo();
            const messageInfo: GameEvents.GameHasFinished = {
                roomId: currentGameStateInfo.roomId,
                gameState: currentGameStateInfo.gameState,
                trackLength: currentGameStateInfo.trackLength,
                numberOfObstacles: currentGameStateInfo.numberOfObstacles,
                playerRanks: this.createPlayerRanks(),
            };

            if (timeOut) CatchFoodGameEventEmitter.emitGameHasTimedOutEvent(messageInfo);
            else {
                clearTimeout(this.timer);
                CatchFoodGameEventEmitter.emitGameHasStoppedEvent({ roomId: this.roomId });
            }
        } catch (e) {
            // throw e.Message;
            // console.error(e.message);
        }
    }

    getGameStateInfo(): GameStateInfo {
        const playerInfoArray = [];

        for (const [, playerState] of Object.entries(this.playersState)) {
            playerInfoArray.push(playerState);
        }

        return {
            gameState: this.gameState,
            roomId: this.roomId,
            playersState: playerInfoArray,
            trackLength: this.trackLength,
            numberOfObstacles: this.numberOfObstacles,
        };
    }

    getObstaclePositions(): HashTable<Array<Obstacle>> {
        const obstaclePositions: HashTable<Array<Obstacle>> = {};
        for (const [, playerState] of Object.entries(this.playersState)) {
            obstaclePositions[playerState.id] = playerState.obstacles;
        }

        return obstaclePositions;
    }

    runForward(userId: string, speed = 1): void {
        try {
            verifyUserId(this.playersState, userId);
            verifyUserIsActive(userId, this.playersState[userId].isActive);
            verifyGameState(this.gameState, [GameState.Started]);

            if (this.playersState[userId].finished) return;
            if (this.playersState[userId].atObstacle) return;

            this.playersState[userId].positionX += speed;

            if (this.playerHasReachedObstacle(userId)) this.handlePlayerReachedObstacle(userId);

            if (this.playerHasPassedGoal(userId)) this.playerHasFinishedGame(userId);
        } catch (e) {
            // throw e;
            // console.error(e.message);
        }
    }

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
        this.playersState[userId].atObstacle = true;
        CatchFoodGameEventEmitter.emitObstacleReachedEvent({
            roomId: this.roomId,
            userId,
            obstacleType: this.playersState[userId].obstacles[0].type,
            obstacleId: this.playersState[userId].obstacles[0].id,
        });
    }

    playerHasCompletedObstacle(userId: string, obstacleId: number): void {
        //TODO: BLOCK USER FROM SAYING COMPLETED STRAIGHT AWAY - STOP CHEATING
        try {
            verifyUserId(this.playersState, userId);
            verifyUserIsActive(userId, this.playersState[userId].isActive);
            verifyGameState(this.gameState, [GameState.Started]);
            this.playersState[userId].atObstacle = false;
            if (this.playersState[userId].obstacles[0].id === obstacleId) {
                this.playersState[userId].obstacles.shift();
            }

            // shouldn't happen - but just to be safe (e.g. in case messages arrive in wrong order)
            if (this.playerHasPassedGoal(userId)) this.playerHasFinishedGame(userId);
        } catch (e) {
            // throw e.Message;
            // console.error(e.message);
        }
    }

    private playerHasFinishedGame(userId: string): void {
        //only if player hasn't already been marked as finished
        if (this.playersState[userId].finished) return;

        this.playersState[userId].finished = true;
        this.playersState[userId].finishedTimeMs = Date.now();
        this.playersState[userId].rank = this.getRank(this.playersState[userId].finishedTimeMs);

        CatchFoodGameEventEmitter.emitPlayerHasFinishedEvent({
            userId,
            roomId: this.roomId,
            rank: this.playersState[userId].rank,
        });

        if (this.gameHasFinished()) {
            this.handleGameFinished();
        }
    }

    private gameHasFinished(): boolean {
        const userIds = Object.keys(this.playersState);
        const activePlayers = userIds.filter(userId => {
            if (this.playersState[userId].isActive) return userId;
        });
        return this.currentRank > activePlayers.length;
    }

    private getRank(timeFinishedInMs: number) {
        const timeFinishedInMsStr: string = timeFinishedInMs.toString();
        //here
        const currentRank = this.currentRank;
        this.currentRank++;

        // if two players finished at the same time
        if (Object.prototype.hasOwnProperty.call(this.ranksDictionary, timeFinishedInMsStr)) {
            return this.ranksDictionary[timeFinishedInMsStr];
        } else {
            this.ranksDictionary[timeFinishedInMsStr] = currentRank;
            return currentRank;
        }
    }

    private handleGameFinished(): void {
        this.gameState = GameState.Finished;
        clearTimeout(this.timer);
        const currentGameStateInfo = this.getGameStateInfo();
        CatchFoodGameEventEmitter.emitGameHasFinishedEvent({
            roomId: currentGameStateInfo.roomId,
            gameState: currentGameStateInfo.gameState,
            trackLength: currentGameStateInfo.trackLength,
            numberOfObstacles: currentGameStateInfo.numberOfObstacles,
            playerRanks: this.createPlayerRanks(),
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
            playerRanks.push({
                id: playerState.id,
                name: playerState.name,
                rank: playerState.rank || this.getRank(playerFinishedTime),
                finished: playerState.finished,
                totalTimeInMs: playerFinishedTime - this.gameStartedTime,
                positionX: playerState.positionX,
                isActive: playerState.isActive,
            });
        }

        return [...playerRanks];
    }

    disconnectPlayer(userId: string): void {
        try {
            verifyUserId(this.playersState, userId);
            verifyUserIsActive(userId, this.playersState[userId].isActive);
            verifyGameState(this.gameState, [
                GameState.Initialised,
                GameState.Started,
                GameState.Created,
                GameState.Paused,
            ]);

            this.playersState[userId].isActive = false;
            CatchFoodGameEventEmitter.emitPlayerHasDisconnected({
                roomId: this.roomId,
                userId,
            });
        } catch (e) {
            //TODO
        }
    }
}
