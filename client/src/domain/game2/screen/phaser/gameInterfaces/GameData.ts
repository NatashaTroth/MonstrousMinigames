import { PlayersState } from './PlayersState';

export interface GameData {
    gameState: string;
    numberOfObstacles: number;
    playersState: PlayersState[];
    roomId: string;
    trackLength: number;
    chasersPositionX: number;
    cameraPositionX: number;
}
