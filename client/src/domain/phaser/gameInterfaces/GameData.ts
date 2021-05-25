import { PlayersState } from './';

export interface GameData {
    gameState: string;
    numberOfObstacles: number;
    playersState: PlayersState[];
    roomId: string;
    trackLength: number;
}
