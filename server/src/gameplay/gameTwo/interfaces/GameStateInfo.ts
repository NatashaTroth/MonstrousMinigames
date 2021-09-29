import { GameState } from '../../enums';
import { IGameStateBase } from '../../interfaces/IGameStateBase';

export interface GameStateInfo extends IGameStateBase {
    roomId: string;
    gameState: GameState;
}
