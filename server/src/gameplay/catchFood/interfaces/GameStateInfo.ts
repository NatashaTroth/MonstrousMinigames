import { PlayerState } from "./PlayerState";
import { HashTable, GameState } from "../../interfaces";
import { Game } from "phaser";

export interface GameStateInfo {
  roomId: string;
  playersState: Array<PlayerState>;
  gameState: GameState;
  trackLength: number;
  numberOfObstacles: number;
}
