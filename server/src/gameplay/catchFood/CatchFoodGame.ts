import GameEventEmitter from '../../classes/GameEventEmitter';
import { User } from '../../interfaces/interfaces';
import { verifyGameState } from '../helperFunctions/verifyGameState';
import { verifyUserId } from '../helperFunctions/verifyUserId';
import { GameEventTypes, GameInterface, GameState, HashTable } from '../interfaces';
import { initiatePlayersState } from './initiatePlayerState';
import { GameStateInfo, Obstacle, PlayerState } from './interfaces';

interface CatchFoodGameInterface extends GameInterface {
    playersState: HashTable<PlayerState>
    trackLength: number
    numberOfObstacles: number

    getGameStateInfo(): GameStateInfo
    getObstaclePositions(): HashTable<Array<Obstacle>>
    runForward(userId: string, speed: number): void
    playerHasCompletedObstacle(userId: string, obstacleId: number): void
    resetGame(players: Array<User>, trackLength: number, numberOfObstacles: number): void
}

export default class CatchFoodGame implements CatchFoodGameInterface {
    playersState: HashTable<PlayerState>
    trackLength: number
    numberOfObstacles: number
    currentRank: number
    gameEventEmitter: GameEventEmitter
    roomId: string
    gameState: GameState
    gameStartedTime: number
    players: Array<User>
    timeOutLimit: number
    timer: ReturnType<typeof setTimeout>
    countdownTime: number

    constructor(players: Array<User>, trackLength = 2000, numberOfObstacles = 2) {
        this.gameEventEmitter = GameEventEmitter.getInstance()
        this.roomId = ""
        this.gameState = GameState.Created  //Intia
        this.trackLength = trackLength
        this.numberOfObstacles = numberOfObstacles
        this.currentRank = 1
        this.players = players
        this.playersState = initiatePlayersState(players, this.numberOfObstacles, this.trackLength)
        this.gameStartedTime = 0
        this.timeOutLimit = 300000
        this.timer = setTimeout(() => ({}), 0)
        this.countdownTime = 3000
    }

    //createNewGame TODO!!!!!!
    createNewGame(players = this.players, trackLength = 2000, numberOfObstacles = 4): void {
        this.gameState = GameState.Created
        this.trackLength = trackLength
        this.numberOfObstacles = numberOfObstacles
        this.currentRank = 1
        this.playersState = initiatePlayersState(players, this.numberOfObstacles, this.trackLength)
        clearTimeout(this.timer)
    }

    //put together
    startGame(): void {
        try {
            verifyGameState(this.gameState, GameState.Created)
            setTimeout(() => {
                this.gameState = GameState.Started
            }, this.countdownTime)
            GameEventEmitter.emitGameHasStartedEvent( {
                roomId: this.roomId,
                countdownTime: this.countdownTime,
            })
            this.gameStartedTime = Date.now()
            // setInterval(this.onTimerTick, 33);
            this.timer = setTimeout(() => {
                this.stopGame(true)
            }, this.timeOutLimit)
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

    stopGame(timeOut = false): void {
        try {
            verifyGameState(this.gameState, GameState.Started)
            this.gameState = GameState.Stopped
            const currentGameStateInfo = this.getGameStateInfo()
            const messageInfo = {   
                roomId: currentGameStateInfo.roomId,
                playersState: currentGameStateInfo.playersState,
                gameState: currentGameStateInfo.gameState,
                trackLength: currentGameStateInfo.trackLength,
                numberOfObstacles: currentGameStateInfo.numberOfObstacles,
            }
            if (timeOut) this.gameEventEmitter.emit(GameEventTypes.GameHasTimedOut, messageInfo)
            else {
                clearTimeout(this.timer)
                if (timeOut) this.gameEventEmitter.emit(GameEventTypes.GameHasStopped, messageInfo)
            }
        } catch (e) {
            // throw e.Message;
            // console.error(e.message);
        }
    }

    getGameStateInfo(): GameStateInfo {
        const playerInfoArray = []

        for (const [, playerState] of Object.entries(this.playersState)) {
            playerInfoArray.push(playerState)
        }

        return {
            gameState: this.gameState,
            roomId: this.roomId,
            playersState: playerInfoArray,
            trackLength: this.trackLength,
            numberOfObstacles: this.numberOfObstacles,
        }
    }

    getObstaclePositions(): HashTable<Array<Obstacle>> {
        const obstaclePositions: HashTable<Array<Obstacle>> = {}
        for (const [, playerState] of Object.entries(this.playersState)) {
            obstaclePositions[playerState.id] = playerState.obstacles
        }

        return obstaclePositions
    }

    runForward(userId: string, speed = 1): void {
        try {
            verifyUserId(this.playersState, userId)
            verifyGameState(this.gameState, GameState.Started)

            if (this.playersState[userId].finished) return
            if (this.playersState[userId].atObstacle) return

            this.playersState[userId].positionX += speed

            if (this.playerHasReachedObstacle(userId)) this.handlePlayerReachedObstacle(userId)

            if (this.playerHasPassedGoal(userId)) this.playerHasFinishedGame(userId)
        } catch (e) {
            // throw e;
            // console.error(e.message);
        }
    }

    private playerHasReachedObstacle(userId: string): boolean {
        return (
            this.playersState[userId].obstacles.length > 0 &&
            this.playersState[userId].positionX >= this.playersState[userId].obstacles[0].positionX
        )
    }

    private playerHasPassedGoal(userId: string): boolean {
        return this.playersState[userId].positionX >= this.trackLength
    }

    private handlePlayerReachedObstacle(userId: string): void {
        // block player from running when obstacle is reached
        this.playersState[userId].atObstacle = true
        this.gameEventEmitter.emit(GameEventTypes.ObstacleReached, {
            roomId: this.roomId,
            userId,
            obstacleType: this.playersState[userId].obstacles[0].type,
            obstacleId: this.playersState[userId].obstacles[0].id,
        })
    }

    playerHasCompletedObstacle(userId: string, obstacleId: number): void {
        //TODO CHange to stop cheating
        try {
            verifyUserId(this.playersState, userId)
            verifyGameState(this.gameState, GameState.Started)
            //TODO: BLOCK USER FROM SAYING COMPLETED STRAIGHT AWAY - STOP CHEATING
            this.playersState[userId].atObstacle = false
            if (this.playersState[userId].obstacles[0].id === obstacleId) this.playersState[userId].obstacles.shift()
        } catch (e) {
            // throw e.Message;
            // console.error(e.message);
        }
    }

    private playerHasFinishedGame(userId: string): void {
        //only if player hasn't already been marked as finished
        if (this.playersState[userId].finished) return

        this.playersState[userId].finished = true
        this.playersState[userId].rank = this.currentRank++

        this.gameEventEmitter.emit(GameEventTypes.PlayerHasFinished, {
            userId,
            roomId: this.roomId,
            rank: this.playersState[userId].rank,
        })

        if (this.gameHasFinished()) {
            this.handleGameFinished()
        }
    }

    private gameHasFinished(): boolean {
        return this.currentRank > Object.keys(this.playersState).length
    }

    private handleGameFinished(): void {
        this.gameState = GameState.Finished
        clearTimeout(this.timer)
        const currentGameStateInfo = this.getGameStateInfo()
        this.gameEventEmitter.emit(GameEventTypes.GameHasFinished, {
            roomId: currentGameStateInfo.roomId,
            playersState: currentGameStateInfo.playersState,
            gameState: currentGameStateInfo.gameState,
            trackLength: currentGameStateInfo.trackLength,
            numberOfObstacles: currentGameStateInfo.numberOfObstacles,
            // playerRanks: get
        })
        //Broadcast, stop game, return ranks
    }


}
