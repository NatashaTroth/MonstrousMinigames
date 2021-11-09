import { PlayersState } from './PlayersState';
import { SheepData } from './SheepData';

export interface GameData {
    gameState: string;
    playersState: PlayersState[];
    sheep: SheepData[];
    lengthX: number;
    lengthY: number;
    roomId: string;
}
