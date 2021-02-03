import { GameState } from "./GameState";
import GameEventEmitter from "../../classes/GameEventEmitter";

export interface GameInterface {
  roomId: string;
  playersState: any;
  gameState: GameState;
  gameEventEmitter: GameEventEmitter;
  currentRank: number;

  startGame(): void;
  stopGame(): void;
  resetGame(
    players: any,
    trackLength?: number,
    numberOfObstacles?: number
  ): void; //TODO change
  getGameStateInfo(): any;
}
