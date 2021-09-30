import { Sheep } from '../Sheep';
import { PlayersState } from './PlayersState';

export interface GameData {
    gameState: string;
    playersState: PlayersState[];
    roomId: string;
    sheep: Sheep[],
    lengthX: number,
    lengthY: number,
}
