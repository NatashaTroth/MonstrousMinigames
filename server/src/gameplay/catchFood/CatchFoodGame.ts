import { PlayerState, Obstacle, ObstacleType } from "./interfaces";
import { HashTable } from "../interfaces";
import { User } from "../../interfaces/interfaces";

export default class CatchFoodGame {
  playersState: HashTable<PlayerState>;
  trackLength: number;
  numberOfObstacles: number;
  currentRank: number;

  constructor(
    players: Array<User>,
    trackLength: number,
    numberOfObstacles: number
  ) {
    this.trackLength = trackLength;
    this.numberOfObstacles = numberOfObstacles;
    this.currentRank = 1;
    this.playersState = {};
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

  createObstacles(): Array<Obstacle> {
    const obstacles: Array<Obstacle> = [];
    const quadrantRange =
      Math.floor(this.trackLength / (this.numberOfObstacles + 1)) - 10; //e.g. 500/4 = 125, +10 to avoid obstacle being at the very beginning, - 10 to stop 2 being right next to eachother

    for (let i = 0; i < this.numberOfObstacles; i++) {
      // TODO: need to be deterministic??
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

  movePlayer(playerId: string, speed: number = 5) {
    if (this.playersState[playerId].atObstacle) return;

    this.playersState[playerId].positionX += speed;

    //TODO: check if player is at obstacle
    if (
      this.playersState[playerId].obstacles.length > 0 &&
      this.playersState[playerId].positionX >=
        this.playersState[playerId].obstacles[0].positionX
    )
      this.handlePlayerReachedObstacle(playerId);
    if (this.playersState[playerId].positionX >= this.trackLength)
      // check if player has passed goal
      this.playerFinishedGame(playerId);

    //TODO: broadcast new player position
    //TODO return obstacle positions
  }

  handlePlayerReachedObstacle(playerId: string) {
    // block player from running when obstacle is reached
    this.playersState[playerId].atObstacle = true;
    //TODO send obstacle type
  }

  playerCompletedObstacle(playerId: string) {
    this.playersState[playerId].atObstacle = false;
    this.playersState[playerId].obstacles.shift();
  }

  playerFinishedGame(playerId: string) {
    this.playersState[playerId].finished = true;
    this.playersState[playerId].rank = this.currentRank++;

    if (this.currentRank > Object.keys(this.playersState).length) {
      this.gameOver();
    }

    //TODO Broadcast
  }

  gameOver() {
    //Broadcast, stop game, return ranks
  }
}
