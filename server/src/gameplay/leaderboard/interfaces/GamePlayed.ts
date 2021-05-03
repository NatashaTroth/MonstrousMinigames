import { IPlayerRank } from '../../interfaces/IPlayerRank';
import { GameType } from '../enums/GameType';

export interface GamePlayed {
    game: GameType;
    playerRanks: Array<IPlayerRank>; // TODO or other types from other games
}
