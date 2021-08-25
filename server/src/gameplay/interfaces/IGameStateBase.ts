import { GameState } from "../enums";

export interface IGameStateBase {
    roomId: string;
    gameState: GameState;
}
