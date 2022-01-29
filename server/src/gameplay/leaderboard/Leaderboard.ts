import { EventEmitter } from "stream";

// import { PlayerRank as GameOnePlayerRank } from '../GameOne/interfaces';
import { IPlayerRank } from "../interfaces/IPlayerRank";
import RankPoints from "./classes/RankPoints";
import { GameType } from "./enums/GameType";
import { GamePlayed, LeaderboardInfo, UserPoints } from "./interfaces";

// TODO handle when user disconnected - remove user? or cross through?

export default class Leaderboard extends EventEmitter {
    public static readonly LEADERBOARD_UPDATED_EVENT = 'leaderboardUpdatedEvent';
    gameHistory: GamePlayed[];
    userPoints: Map<string, UserPoints>; //<userId, userPoints>

    // rankPointsDictionary: HashTable<number>; //dicionary[rank] = points

    constructor(private roomId: string) {
        super();
        this.gameHistory = [];
        this.userPoints = new Map<string, UserPoints>();
    }

    addUser(userId: string, username: string): void {
        if (!this.userPoints.has(userId)) {
            this.userPoints.set(userId, { userId: userId, name: username, points: 0, rank: 0 });
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
        this.gameHistory.push({
            game,
            playerRanks: playerRanks.map(playerRank => {
                let points = 0;

                if (playerRank.finished) {
                    points = RankPoints.getPointsFromRank(playerRank.rank);
                }
                return { ...playerRank, points };
            }),
        });
        this.updateUserPointsAfterGame(playerRanks);
        this.sendUpdatedLeaderboardState();
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
        if (!this.userPoints.has(userId)) this.addUser(userId, username);
        this.userPoints.get(userId)!.points += points;
    }

    private updateUserPointsAfterGame(playerRanks: IPlayerRank[]): void {
        playerRanks.forEach(playerRank => {
            if (playerRank.finished) {
                this.addUserPoints(playerRank.id, playerRank.name, RankPoints.getPointsFromRank(playerRank.rank));
            }
        });
    }

    private getUserPointsArray(): UserPoints[] {
        const userPointsArray: UserPoints[] = [];
        this.userPoints.forEach(userPoint => {
            userPointsArray.push(userPoint);
        });

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
