import { PlayerRank } from '../../catchFood/interfaces';
import { GameType } from '../enums/GameType';

export interface GamePlayed {
    game: GameType;
    playerRanks: Array<PlayerRank>; // TODO or other types from other games
}
