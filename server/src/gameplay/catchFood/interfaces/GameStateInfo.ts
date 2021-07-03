import { GameState } from '../../enums';
import { PlayerStateForClient } from './';

export interface GameStateInfo {
    roomId: string;
    playersState: Array<PlayerStateForClient>;
    gameState: GameState;
    trackLength: number;
    numberOfObstacles: number;
    chasersPositionX: number;
    chasersAreRunning: boolean;
    cameraPositionX: number;
}
