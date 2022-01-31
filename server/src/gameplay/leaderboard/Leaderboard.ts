import { EventEmitter } from 'stream';

// import { PlayerRank as GameOnePlayerRank } from '../GameOne/interfaces';
import { IPlayerRank } from '../interfaces/IPlayerRank';
import RankPoints from './classes/RankPoints';
import { GameType } from './enums/GameType';
import { GamePlayed, LeaderboardInfo, UserPoints } from './interfaces';

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
            this.userPoints.set(userId, { userId: userId, name: username, points: 0, rank: 0, playedGame: false });
            this.sendUpdatedLeaderboardState();
        }
    }

    // addUsers(users: User[]): void {
    //     users.forEach(user => {
    //         this.addUser(user.id, user.name);
    //     });

    // }

    //TODO add points to game history playerranks!!
    addGameToHistory(game: GameType, playerRanks: IPlayerRank[]): Map<string, number> {
        const currentGamePoints = new Map<string, number>();
        this.gameHistory.push({
            game,
            playerRanks: playerRanks
                .map(playerRank => {
                    let points = 0;

                    if (playerRank.finished) {
                        points = RankPoints.getPointsFromRank(playerRank.rank);
                        currentGamePoints.set(playerRank.id, points);
                    }
                    return { ...playerRank, points };
                })
                .sort((a, b) => a.rank - b.rank),
        });
        this.updateUserPointsAfterGame(playerRanks);
        this.sendUpdatedLeaderboardState();
        return currentGamePoints;
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
        const user = this.userPoints.get(userId)!;
        user.points += points;
        user.playedGame = true;
    }

    private updateUserPointsAfterGame(playerRanks: IPlayerRank[]): void {
        playerRanks.forEach(playerRank => {
            if (playerRank.finished) {
                this.addUserPoints(playerRank.id, playerRank.name, RankPoints.getPointsFromRank(playerRank.rank));
            }
        });
    }

    private getUserPointsArray(): UserPoints[] {
        let userPointsArray: UserPoints[] = [];
        this.userPoints.forEach(userPoint => {
            if (userPoint.playedGame) userPointsArray.push(userPoint);
        });

        //sort by points (descending)
        userPointsArray.sort((a, b) => {
            return b.points - a.points;
        });
        userPointsArray = userPointsArray.map((userPoints, idx) => {
            return { ...userPoints, rank: idx + 1 };
        });
        return [...userPointsArray];
    }

    private sendUpdatedLeaderboardState() {
        this.emit(Leaderboard.LEADERBOARD_UPDATED_EVENT, this);
    }
}
