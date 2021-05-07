import { GamePlayed, UserPoints } from './';

export interface LeaderboardInfo {
    roomId: string;
    gameHistory: Array<GamePlayed>;
    userPoints: Array<UserPoints>; //sorted by points
}
