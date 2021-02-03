import { PlayerState } from "./PlayerState";
import { HashTable } from "../../interfaces";

export interface GameState {
  roomId: string;
  playersState: HashTable<PlayerState>;
  gameOver: boolean;
  trackLength: number;
  numberOfObstacles: number;
}
