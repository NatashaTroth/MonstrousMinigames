import User from '../../classes/user';
import { PlayerRank } from '../catchFood/interfaces';
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

    // updateUserPoints(userId: string) {
    //     if(Object.prototype.hasOwnProperty.call(this.userPoints, userId)){
    //         this.userPoints[userId]

    //     }
    //     else{
    //         //error
    //     }
    // }

    // disconnectUser() {}
}
