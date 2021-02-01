import { PlayerState, Obstacle, ObstacleType } from "./interfaces";
import { HashTable } from "../interfaces";
import { User } from "../../interfaces/interfaces";

export default class CatchFood {
  playersState: HashTable<PlayerState>;
  trackLength: number;
  numberOfObstacles: number;
  currentRank: number;

  constructor(
    players: Array<User>,
    trackLength: number,
    numberOfObstacles: number
  ) {
    this.playersState = {};
    players.forEach((player) => {
      this.playersState[player.id] = {
        id: player.id,
        name: player.name,
        positionX: 0,
        obstacles: this.setObstacles(),
        atObstacle: false,
        finished: false,
        rank: 0,
      };
    });

    this.trackLength = trackLength;
    this.numberOfObstacles = numberOfObstacles;
    this.currentRank = 1;
  }

  setObstacles(): Array<Obstacle> {
    const obstacles: Array<Obstacle> = [];
    const quadrantRange = this.trackLength / this.numberOfObstacles + 1 - 10; //e.g. 500/4 = 125, +1 to avoid obstacle being at the very beginning, - 10 to stop 2 being right next to eachother
    for (let i = 0; i < this.numberOfObstacles; i++) {
      // TODO: need to be deterministic??
      let position =
        Math.floor(Math.random() * (quadrantRange * (i + 2))) + quadrantRange;
      position = Math.round(position / 10) * 10; //round to nearest 10 (to stop exactly at it)
      obstacles.push({
        positionX: position,
        type: ObstacleType.TreeStump, //TODO
      });
    }

    return obstacles;
  }

  movePlayer(playerId: string) {
    if (this.playersState[playerId].atObstacle) return;

    this.playersState[playerId].positionX += 5;

    //TODO: check if player is at obstacle
    if (
      this.playersState[playerId].positionX >=
      this.playersState[playerId].obstacles[0].positionX
    )
      this.handlePlayerReachedObstacle(playerId);
    if (this.playersState[playerId].positionX > this.trackLength)
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

  handlePlayerCompletedObstacle(playerId: string) {
    this.playersState[playerId].atObstacle = true;
    this.playersState[playerId].obstacles.shift();
  }

  playerFinishedGame(playerId: string) {
    this.playersState[playerId].finished = true;
    this.playersState[playerId].rank = this.currentRank;
    this.currentRank++;

    if (this.currentRank > Object.keys(this.playersState).length) {
      this.gameOver();
    }

    //TODO Broadcast
  }

  gameOver() {
    //Broadcast, stop game, return ranks
  }
}
