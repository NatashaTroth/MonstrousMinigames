import { PlayerState } from "./PlayerState";
import { GameState } from "../../interfaces";

export interface GameStateInfo {
  roomId: string;
  playersState: Array<PlayerState>;
  gameState: GameState;
  trackLength: number;
  numberOfObstacles: number;
}
