import User from '../../classes/user';
// import { PlayerRank as CatchFoodPlayerRank } from '../catchFood/interfaces';
import { verifyUserId } from '../helperFunctions/verifyUserId';
import { HashTable } from '../interfaces';
import { IPlayerRank } from '../interfaces/IPlayerRank';
import { GameType } from './enums/GameType';
import { GamePlayed } from './interfaces/GamePlayed';
import { UserPoints } from './interfaces/UserPoints';

export default class Leaderboard {
    roomId: string;
    gameHistory: Array<GamePlayed>;
    userPoints: HashTable<UserPoints>;
    rankPointsDictionary: HashTable<number>; //dicionary[rank] = points

    constructor(roomId: string) {
        this.roomId = roomId;
        this.gameHistory = [];
        this.userPoints = {};
        this.rankPointsDictionary = { '1': 5, '2': 3, '3': 2, '4': 1 }; // TODO move to global enums
    }

    addGame(game: GameType, playerRanks: Array<IPlayerRank> /* TODO or other*/): void {
        this.gameHistory.push({ game, playerRanks });
    }

    addUser(userId: string, username: string): void {
        this.userPoints[userId] = { userId: userId, name: username, points: 0 };
    }

    addUsers(users: Array<User>): void {
        users.forEach(user => {
            this.addUser(user.id, user.name);
        });
    }

    addUserPoints(userId: string, points: number): void {
        verifyUserId(this.userPoints, userId);
        this.userPoints[userId].points += points;
    }

    updateUserPointsAfterGame(playerRanks: Array<IPlayerRank>): void {
        playerRanks.forEach(playerRank => {
            ///TODO errorhandling
            if (Object.prototype.hasOwnProperty.call(this.userPoints, playerRank.id))
                this.userPoints[playerRank.id].points += this.rankPointsDictionary[playerRank.rank];
        });
    }
}
