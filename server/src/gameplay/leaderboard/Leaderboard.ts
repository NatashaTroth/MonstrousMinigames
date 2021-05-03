// import User from '../../classes/user';
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

    // updateUserPoints(userId: string) {
    //     if(Object.prototype.hasOwnProperty.call(this.userPoints, userId)){
    //         this.userPoints[userId]

    //     }
    //     else{
    //         //error
    //     }
    // }

    // addUser(user: User) {
    //     this.userPoints[user.id] = { userId: user.id, name: user.name, points: 0 };
    // }

    // disconnectUser() {}
}
