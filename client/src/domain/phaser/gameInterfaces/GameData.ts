import { PlayersState } from './';

export interface GameData {
    chasersPositionX: number;
    gameState: string;
    numberOfObstacles: number;
    playersState: PlayersState[];
    roomId: string;
    trackLength: number;
}
