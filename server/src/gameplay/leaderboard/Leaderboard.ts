import { EventEmitter } from 'stream';

import { localDevelopment } from '../../../constants';
// import { PlayerRank as GameOnePlayerRank } from '../GameOne/interfaces';
import { HashTable } from '../interfaces';
import { IPlayerRank } from '../interfaces/IPlayerRank';
import { GameType } from './enums/GameType';
import rankPointsDictionary from './globalVars/rankPointsDictionary';
import { GamePlayed, LeaderboardInfo, UserPoints } from './interfaces';
import { gameHistory, userPoints } from './mockData';

// TODO handle when user disconnected - remove user? or cross through?

export default class Leaderboard extends EventEmitter {
    public static readonly LEADERBOARD_UPDATED_EVENT = 'leaderboardUpdatedEvent';
    gameHistory: GamePlayed[];
    userPoints: HashTable<UserPoints>;
    rankPointsDictionary: HashTable<number>; //dicionary[rank] = points

    constructor(private roomId: string) {
        super();
        this.gameHistory = [];
        this.userPoints = {};
        this.rankPointsDictionary = rankPointsDictionary;
    }

    addUser(userId: string, username: string): void {
        if (!Object.prototype.hasOwnProperty.call(this.userPoints, userId)) {
            this.userPoints[userId] = { userId: userId, name: username, points: 0, rank: 0 };
            this.sendUpdatedLeaderboardState();
        }
    }

    // addUsers(users: User[]): void {
    //     users.forEach(user => {
    //         this.addUser(user.id, user.name);
    //     });

    // }

    //TODO add points to game history playerranks!!
    addGameToHistory(game: GameType, playerRanks: IPlayerRank[]): void {
        this.gameHistory.push({ game, playerRanks });
        this.updateUserPointsAfterGame(playerRanks);
        this.sendUpdatedLeaderboardState();
    }

    getLeaderboardInfo(): LeaderboardInfo {
        if (localDevelopment) {
            //mockData
            return {
                roomId: this.roomId,
                gameHistory,
                userPoints,
            };
        }

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

    private updateUserPointsAfterGame(playerRanks: IPlayerRank[]): void {
        playerRanks.forEach(playerRank => {
            // if (!Object.prototype.hasOwnProperty.call(this.userPoints, playerRank.id))
            if (playerRank.finished) {
                this.addUserPoints(playerRank.id, playerRank.name, this.rankPointsDictionary[playerRank.rank]);
            }
        });
    }

    private getUserPointsArray(): UserPoints[] {
        const userPointsArray = [];
        for (const [, userPointsObj] of Object.entries(this.userPoints)) {
            userPointsArray.push(userPointsObj);
        }

        //sort by points (descending)
        userPointsArray.sort((a, b) => {
            return b.points - a.points;
        });
        userPointsArray.map((userPoints, idx) => ({ ...userPoints, rank: idx }));
        return [...userPointsArray];
    }

    private sendUpdatedLeaderboardState() {
        this.emit(Leaderboard.LEADERBOARD_UPDATED_EVENT, this);
    }
}
