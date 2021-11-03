import { GameState } from '../../enums';
import { IGameStateBase } from '../../interfaces/IGameStateBase';
import { PlayerStateForClient } from './';

export interface GameStateInfo extends IGameStateBase {
    roomId: string;
    playersState: Array<PlayerStateForClient>;
    gameState: GameState;
    chasersPositionX: number;
    cameraPositionX: number;
}
