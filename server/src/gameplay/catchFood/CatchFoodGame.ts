import { PlayerState, Obstacle, ObstacleType, GameState } from "./interfaces";
import { HashTable } from "../interfaces";
import { User } from "../../interfaces/interfaces";
import GameEventEmitter from "../../classes/GameEventEmitter";

export default class CatchFoodGame {
  playersState: HashTable<PlayerState>;
  trackLength: number;
  numberOfObstacles: number;
  currentRank: number;
  gameOver: boolean;
  gameEventEmitter: GameEventEmitter;
  roomId: string;

  constructor(
    players: Array<User>,
    trackLength: number = 2000,
    numberOfObstacles: number = 4
  ) {
    this.gameEventEmitter = GameEventEmitter.getInstance();
    this.roomId = players[0].roomId;
    this.trackLength = trackLength;
    this.numberOfObstacles = numberOfObstacles;
    this.currentRank = 1;
    this.playersState = {};
    this.gameOver = false;
    this.initiatePlayersState(players);
  }

  getGameState(): GameState {
    return {
      roomId: this.roomId,
      playersState: this.playersState,
      gameOver: this.gameOver,
      trackLength: this.trackLength,
      numberOfObstacles: this.numberOfObstacles,
    };
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

  getObstaclePositions(): HashTable<Array<Obstacle>> {
    const obstaclePositions: HashTable<Array<Obstacle>> = {};
    for (const [key, playerState] of Object.entries(this.playersState)) {
      // const obstacles = []
      obstaclePositions[playerState.id] = playerState.obstacles;

      // for(let i = 0; i < playerState.obstacles.length; i++){
      //   obstacles.push({type ob
      //     positionX: number;})
      // }
    }

    return obstaclePositions;
  }

  movePlayer(playerId: string, speed: number = 1) {
    if (this.playersState[playerId].atObstacle) return;

    this.playersState[playerId].positionX += speed;

    if (this.playerHasReachedObstacle(playerId))
      this.handlePlayerReachedObstacle(playerId);

    if (this.playerHasPassedGoal(playerId))
      this.playerHasFinishedGame(playerId);
  }

  private playerHasReachedObstacle(playerId: string) {
    return (
      this.playersState[playerId].obstacles.length > 0 &&
      this.playersState[playerId].positionX >=
        this.playersState[playerId].obstacles[0].positionX
    );
  }
  private playerHasPassedGoal(playerId: string) {
    return this.playersState[playerId].positionX >= this.trackLength;
  }

  private handlePlayerReachedObstacle(playerId: string) {
    // block player from running when obstacle is reached
    this.playersState[playerId].atObstacle = true;
    this.gameEventEmitter.emit("obstacleReached", {
      roomId: this.roomId,
      playerId,
      type: this.playersState[playerId].obstacles[0].type,
    });
  }

  playerHasCompletedObstacle(playerId: string) {
    //TODO: BLOCK USER FROM SAYING COMPLETED STRAIGHT AWAY - STOP CHEATING
    this.playersState[playerId].atObstacle = false;
    this.playersState[playerId].obstacles.shift();
  }

  private playerHasFinishedGame(playerId: string) {
    this.playersState[playerId].finished = true;
    this.playersState[playerId].rank = this.currentRank++;

    if (this.gameIsOver()) {
      this.handleGameOver();
    } else {
      //TODO Broadcast
    }
  }

  private gameIsOver(): boolean {
    return this.currentRank > Object.keys(this.playersState).length;
  }

  private handleGameOver() {
    this.gameOver = true;
    //Broadcast, stop game, return ranks
  }

  resetGame(
    players: Array<User>,
    trackLength: number = 2000,
    numberOfObstacles: number = 4
  ) {
    this.trackLength = trackLength;
    this.numberOfObstacles = numberOfObstacles;
    this.currentRank = 1;
    this.playersState = {};
    this.gameOver = false;
    this.initiatePlayersState(players);
  }
}
