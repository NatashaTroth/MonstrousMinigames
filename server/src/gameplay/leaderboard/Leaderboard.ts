import User from '../../classes/user';
// import { PlayerRank as GameOnePlayerRank } from '../GameOne/interfaces';
import { HashTable } from '../interfaces';
import { IPlayerRank } from '../interfaces/IPlayerRank';
import { GameType } from './enums/GameType';
import rankPointsDictionary from './globalVars/rankPointsDictionary';
import { GamePlayed, LeaderboardInfo, UserPoints } from './interfaces';

export default class Leaderboard {
    roomId: string;
    gameHistory: Array<GamePlayed>;
    userPoints: HashTable<UserPoints>;
    rankPointsDictionary: HashTable<number>; //dicionary[rank] = points

    constructor(roomId: string) {
        this.roomId = roomId;
        this.gameHistory = [];
        this.userPoints = {};
        this.rankPointsDictionary = rankPointsDictionary;
    }

    addUser(userId: string, username: string): void {
        if (!Object.prototype.hasOwnProperty.call(this.userPoints, userId))
            this.userPoints[userId] = { userId: userId, name: username, points: 0 };
    }

    addUsers(users: Array<User>): void {
        users.forEach(user => {
            this.addUser(user.id, user.name);
        });
    }

    addGameToHistory(game: GameType, playerRanks: Array<IPlayerRank>): void {
        this.gameHistory.push({ game, playerRanks });
        this.updateUserPointsAfterGame(playerRanks);
    }

    getLeaderboardInfo(): LeaderboardInfo {
        return {
            roomId: this.roomId,
            gameHistory: [...this.gameHistory],
            userPoints: this.getUserPointsArray(),
        };
    }

    private addUserPoints(userId: string, username: string, points: number): void {
        //if user not yet added, add user to leaderboard
        if (!Object.prototype.hasOwnProperty.call(this.userPoints, userId)) this.addUser(userId, username);
        this.userPoints[userId].points += points;
    }

    private updateUserPointsAfterGame(playerRanks: Array<IPlayerRank>): void {
        playerRanks.forEach(playerRank => {
            // if (!Object.prototype.hasOwnProperty.call(this.userPoints, playerRank.id))
            if (playerRank.finished) {
                this.addUserPoints(playerRank.id, playerRank.name, this.rankPointsDictionary[playerRank.rank]);
            }
        });
    }

    private getUserPointsArray(): Array<UserPoints> {
        const userPointsArray = [];
        for (const [, userPointsObj] of Object.entries(this.userPoints)) {
            userPointsArray.push(userPointsObj);
        }

        //sort by points (descending)
        userPointsArray.sort((a, b) => {
            return b.points - a.points;
        });
        return [...userPointsArray];
    }
}
