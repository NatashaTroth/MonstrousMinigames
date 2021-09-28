import { GameState } from '../../enums';
import { IGameStateBase } from '../../interfaces/IGameStateBase';
import { PlayerStateForClient } from './';

export interface InitialGameStateInfo extends IGameStateBase {
    roomId: string;
    trackLength: number;
    numberOfObstacles: number;
    playersState: Array<PlayerStateForClient>;
    gameState: GameState;
    chasersPositionX: number;
    cameraPositionX: number;
}
