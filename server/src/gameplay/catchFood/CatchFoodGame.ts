import {
  PlayerState,
  Obstacle,
  ObstacleType,
  GameStateInfo,
} from "./interfaces";
import { HashTable, GameEventTypes, GameState } from "../interfaces";
import { User } from "../../interfaces/interfaces";
import GameEventEmitter from "../../classes/GameEventEmitter";
import { Game } from "phaser";
import { verifyGameState } from "../helperFunctions/verifyGameState";

export default class CatchFoodGame {
  playersState: HashTable<PlayerState>;
  trackLength: number;
  numberOfObstacles: number;
  currentRank: number;
  gameEventEmitter: GameEventEmitter;
  roomId: string;
  gameState: GameState;

  constructor(
    players: Array<User>,
    trackLength: number = 2000,
    numberOfObstacles: number = 4
  ) {
    this.gameEventEmitter = GameEventEmitter.getInstance();
    this.roomId = players[0].roomId;
    this.gameState = GameState.Created;
    this.trackLength = trackLength;
    this.numberOfObstacles = numberOfObstacles;
    this.currentRank = 1;
    this.playersState = {};
    this.initiatePlayersState(players);
  }

  private initiatePlayersState(players: Array<User>) {
    players.forEach((player) => {
      this.playersState[player.id] = {
        id: player.id,
        name: player.name,
        positionX: 0,
        obstacles: this.createObstacles(),
        atObstacle: false,
        finished: false,
        rank: 0,
      };
    });
  }

  private createObstacles(): Array<Obstacle> {
    const obstacles: Array<Obstacle> = [];
    const quadrantRange =
      Math.floor(this.trackLength / (this.numberOfObstacles + 1)) - 10; //e.g. 500/4 = 125, +10 to avoid obstacle being at the very beginning, - 10 to stop 2 being right next to eachother

    for (let i = 0; i < this.numberOfObstacles; i++) {
      let randomNr = 0 * quadrantRange;

      let position = randomNr + quadrantRange * (i + 1);
      position = Math.round(position / 10) * 10; //round to nearest 10 (to stop exactly at it)

      obstacles.push({
        positionX: position,
        type: ObstacleType.TreeStump, //TODO
      });
    }

    return [...obstacles];
  }

  startGame() {
    try {
      verifyGameState(this.gameState, GameState.Created);
      this.gameState = GameState.Started;
      this.gameEventEmitter.emit(GameEventTypes.GameHasStarted, {
        countdownTime: 3000,
      });
    } catch (e) {
      throw e.Message;
    }
  }

  stopGame() {
    try {
      verifyGameState(this.gameState, GameState.Started);
      this.gameState = GameState.Stopped;
    } catch (e) {
      throw e.Message;
    }
  }

  getGameStateInfo(): GameStateInfo {
    return {
      gameState: this.gameState,
      roomId: this.roomId,
      playersState: this.playersState, //TODO MAGDA
      trackLength: this.trackLength,
      numberOfObstacles: this.numberOfObstacles,
    };
  }

  getObstaclePositions(): HashTable<Array<Obstacle>> {
    const obstaclePositions: HashTable<Array<Obstacle>> = {};
    for (const [key, playerState] of Object.entries(this.playersState)) {
      obstaclePositions[playerState.id] = playerState.obstacles;
    }

    return obstaclePositions;
  }

  movePlayer(userId: string, speed: number = 1) {
    try {
      verifyGameState(this.gameState, GameState.Started);
      if (this.playersState[userId].atObstacle) return;

      this.playersState[userId].positionX += speed;

      if (this.playerHasReachedObstacle(userId))
        this.handlePlayerReachedObstacle(userId);

      if (this.playerHasPassedGoal(userId)) this.playerHasFinishedGame(userId);
    } catch (e) {
      throw e.Message;
    }
  }

  private playerHasReachedObstacle(userId: string) {
    return (
      this.playersState[userId].obstacles.length > 0 &&
      this.playersState[userId].positionX >=
        this.playersState[userId].obstacles[0].positionX
    );
  }

  private playerHasPassedGoal(userId: string) {
    return this.playersState[userId].positionX >= this.trackLength;
  }

  private handlePlayerReachedObstacle(userId: string) {
    // block player from running when obstacle is reached
    this.playersState[userId].atObstacle = true;
    this.gameEventEmitter.emit(GameEventTypes.ObstacleReached, {
      roomId: this.roomId,
      userId,
      obstacleType: this.playersState[userId].obstacles[0].type,
    });
  }

  playerHasCompletedObstacle(userId: string) {
    try {
      verifyGameState(this.gameState, GameState.Started);
      //TODO: BLOCK USER FROM SAYING COMPLETED STRAIGHT AWAY - STOP CHEATING
      this.playersState[userId].atObstacle = false;
      this.playersState[userId].obstacles.shift();
    } catch (e) {
      throw e.Message;
    }
  }

  private playerHasFinishedGame(userId: string) {
    this.playersState[userId].finished = true;
    this.playersState[userId].rank = this.currentRank++;

    this.gameEventEmitter.emit(GameEventTypes.PlayerHasFinished, {
      userId,
      rank: this.playersState[userId].rank,
    });

    if (this.gameIsOver()) {
      this.handleGameFinished();
    }
  }

  private gameIsOver(): boolean {
    return this.currentRank > Object.keys(this.playersState).length;
  }

  private handleGameFinished() {
    this.gameState = GameState.Finished;
    //Broadcast, stop game, return ranks
  }

  resetGame(
    players: Array<User>,
    trackLength: number = 2000,
    numberOfObstacles: number = 4
  ) {
    this.gameState = GameState.Created;
    this.trackLength = trackLength;
    this.numberOfObstacles = numberOfObstacles;
    this.currentRank = 1;
    this.playersState = {};
    this.initiatePlayersState(players);
  }
}
