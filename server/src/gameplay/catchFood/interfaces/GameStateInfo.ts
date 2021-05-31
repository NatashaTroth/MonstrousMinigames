import { GameState } from '../../enums';
import { PlayerState } from './';

export interface GameStateInfo {
    roomId: string;
    playersState: Array<PlayerState>;
    gameState: GameState;
    trackLength: number;
    numberOfObstacles: number;
    chasersPositionX: number;
}
