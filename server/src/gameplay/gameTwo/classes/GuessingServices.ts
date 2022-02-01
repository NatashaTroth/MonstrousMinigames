import { RankData } from "../interfaces";
import Parameters from "../constants/Parameters";
import { GuessHints } from "../enums/GuessHints";
import { GameTwoPlayerRank } from "../interfaces/GameTwoPlayerRank";
import User from "../../../classes/user";

export default class GuessingService {
    private roundCount: number;
    public counts: number[];
    public guesses: Map<string, number[]>;
    public playerRanks: Map<string, GameTwoPlayerRank>;
    constructor(roundCount: number) {
        this.roundCount = roundCount;
        this.counts = new Array(roundCount);
        this.guesses = new Map<string, number[]>();
        this.playerRanks = new Map<string, GameTwoPlayerRank>();
    }

    public init(users: User[]): void {
        users.forEach(user => {
            this.guesses.set(user.id, new Array(this.roundCount));
            const playerRank = {
                id: user.id,
                name: user.name,
                rank: 0,
                isActive: user.active,
                points: 0,
                previousRank: null,
                finished: true
            }
            this.playerRanks.set(user.id, playerRank);
        });
    }

    public getHintForRound(round: number, userId: string): string {
        const guess = this.getGuessForRound(round, userId);
        const count = this.getCountForRound(round);
        if (guess && count) {
            return this.getHint(count - guess);
        }
        return '';
    }

    public getAverageDifference(userId: string){
        const guesses = this.guesses.get(userId);
        let differences = 0;
        if(guesses){
            for(let i = 0; i < this.roundCount; i++){
                differences += ((guesses[i] - this.counts[i]) * -1);
            }
        }
        return differences / this.roundCount;
    }


    public getHint(miss: number): string {
        if (miss > 0) {
            if (miss <= Parameters.GOOD_GUESS_THRESHOLD) {
                return GuessHints.BIT_LOW;
            } else if (miss >= Parameters.BAD_GUESS_THRESHOLD) {
                return GuessHints.VERY_LOW;
            } else {
                return GuessHints.LOW;
            }
        } else if (miss < 0) {
            miss = miss * -1;
            if (miss <= Parameters.GOOD_GUESS_THRESHOLD) {
                return GuessHints.BIT_HIGH;
            } else if (miss >= Parameters.BAD_GUESS_THRESHOLD) {
                return GuessHints.VERY_HIGH;
            } else {
                return GuessHints.HIGH;
            }
        } else {
            return GuessHints.EXACT;
        }
    }

    public addGuess(round: number, guess: number, userId: string): boolean {
        const guesses = this.guesses.get(userId);
        if (guesses && !guesses[round - 1]) {
            guesses[round - 1] = guess;
            this.guesses.set(userId, guesses);
            return true;
        }
        return false;
    }
    private getGuessForRound(round: number, userId: string): number | null {
        const guesses = this.getGuessesForUser(userId);
        if (guesses) {
            return guesses[round - 1];
        }
        return null;
    }
    private getGuessesForUser(userId: string): number[] | null {
        const guesses = this.guesses.get(userId);
        if (guesses) {
            return guesses;
        }
        return null;
    }

    public saveSheepCount(round: number, count: number): boolean {
        if (!this.counts[round - 1] && round <= this.roundCount) {
            this.counts[round - 1] = count;
            return true;
        }
        return false;
    }

    public getCountForRound(round: number): number | null {
        if (this.counts[round - 1]) {
            return this.counts[round - 1];
        } else {
            return null;
        }
    }

    public allGuessesSubmitted(round: number): boolean {
        const count = [...this.guesses.entries()].reduce(function (result, item) {
            if (item[1][round - 1]) return result + 1;
            return result;
        }, 0);

        return count === this.guesses.size;
    }
    public getPlayerRanks() {
        return [...this.playerRanks].map(([name, value]) => (value));
    }

    public calculatePlayerRanks() {
        this.calculatePoints();
        this.calculateRankData();
    }

    private calculatePoints() {
        const round = this.getCurrendRound();

        const differences = [...this.guesses].map(([id, guesses]) => {
            const difference = guesses[round - 1] ? Math.abs(this.counts[round - 1] - guesses[round - 1]) : 10000;
            return { id, difference }
        }).sort((a, b) => (a.difference - b.difference));
        let newPoints = 3;
        let lastDifference: number;
        differences.forEach((entry) => {
            const currentRank = this.playerRanks.get(entry.id);
            if (currentRank) {
                if (entry.difference !== lastDifference){  
                    currentRank.points += newPoints;
                }else{
                    currentRank.points += newPoints + 1;
                }
                newPoints--;
                lastDifference = entry.difference;
            }
        });
    }

    private calculateRankData(): void {
        let currentRank = 1;
        let previouspoints: number;

        const rankData = [...this.playerRanks].map(([id, playerRank]) => ({ id: id, points: playerRank.points, rank: playerRank.rank, previousRank: playerRank.previousRank })
        ).sort((a, b) => (b.points - a.points)).map((rankData) => {
            rankData.previousRank = rankData.rank;
            if (previouspoints && previouspoints !== rankData.points) {
                currentRank++;
            }
            rankData.rank = currentRank;
            previouspoints = rankData.points;
            return rankData;
        });

        this.updatePlayerRanks(rankData);
    }
    private updatePlayerRanks(rankData: RankData[]) {
        rankData.forEach(entry => {
            const currentRank = this.playerRanks.get(entry.id);
            if (currentRank) {
                currentRank.previousRank = currentRank.rank;
                currentRank.rank = entry.rank;
            }
        })
    }
    private getCurrendRound() {
        return this.counts.filter(count => {
            return count !== undefined;
        }).length
    }
}
