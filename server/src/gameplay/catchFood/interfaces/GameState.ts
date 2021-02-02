import { PlayerState } from "./PlayerState";
import { HashTable } from "../../interfaces";

export interface GameState {
  playersState: HashTable<PlayerState>;
  gameOver: boolean;
}
