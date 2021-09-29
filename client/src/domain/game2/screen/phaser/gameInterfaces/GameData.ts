import { PlayersState } from './PlayersState';

export interface GameData {
    gameState: string;
    playersState: PlayersState[];
    roomId: string;
}
