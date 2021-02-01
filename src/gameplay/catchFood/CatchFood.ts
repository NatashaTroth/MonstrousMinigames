import { PlayerState } from "./PlayerState";
import { Player } from "../../Player";

export default class CatchFood {
  players: Array<PlayerState>;

  constructor(players: Array<Player>) {
    this.players = players.map((player) => {
      return {
        id: player.id,
        name: player.name,
        positionX: 0,
        finished: false,
        rank: 0,
      };
    });
  }
}
