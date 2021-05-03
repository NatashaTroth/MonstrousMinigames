import User from '../../classes/user';
import { PlayerRank } from '../catchFood/interfaces';
import { verifyUserId } from '../helperFunctions/verifyUserId';
import { HashTable } from '../interfaces';
import { GameType } from './enums/GameType';
import { GamePlayed } from './interfaces/GamePlayed';
import { UserPoints } from './interfaces/UserPoints';

export default class Leaderboard {
    roomId: string;
    gameHistory: Array<GamePlayed>;
    userPoints: HashTable<UserPoints>;

    constructor(roomId: string) {
        this.roomId = roomId;
        this.gameHistory = [];
        this.userPoints = {};
    }

    addGame(game: GameType, playerRanks: Array<PlayerRank> /* TODO or other*/) {
        this.gameHistory.push({ game, playerRanks });
    }

    addUser(userId: string, username: string) {
        this.userPoints[userId] = { userId: userId, name: username, points: 0 };
    }

    addUsers(users: Array<User>) {
        users.forEach(user => {
            this.addUser(user.id, user.name);
        });
    }

    addUserPoints(userId: string, points: number) {
        verifyUserId(this.userPoints, userId);
        this.userPoints[userId].points += points;
    }
}
