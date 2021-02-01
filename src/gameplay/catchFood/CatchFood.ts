import { PlayerState } from "./PlayerState";
import { HashTable } from "../HashTable";
import { Player } from "../../Player";

export default class CatchFood {
  playersState: HashTable<PlayerState>;
  trackLength: number;

  constructor(players: Array<Player>) {
    this.playersState = {};
    players.forEach((player) => {
      this.playersState[player.id] = {
        id: player.id,
        name: player.name,
        positionX: 0,
        finished: false,
        rank: 0,
      };
    });
    // this.players = players.map((player) => {
    //   return {
    //     id: player.id,
    //     name: player.name,
    //     positionX: 0,
    //     finished: false,
    //     rank: 0,
    //   };
    // });

    this.trackLength = 500;
  }

  movePlayer(playerId: string) {
    this.playersState[playerId].positionX += 5;

    //TODO: broadcast new player position
  }
}
