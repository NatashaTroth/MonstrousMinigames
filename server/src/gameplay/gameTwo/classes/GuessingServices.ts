import User from "../../../classes/user";
import Parameters from "../constants/Parameters";
import { GuessHints } from "../enums/GuessHints";
import { RankData } from "../interfaces";
import { GameTwoPlayerRank } from "../interfaces/GameTwoPlayerRank";

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
                previousRank: null
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

    public getHint(miss: number): string {
        if (miss > 0 && miss <= Parameters.GOOD_GUESS_THRESHOLD) {
            return GuessHints.LOW;
        } else if (miss > 0) {
            return GuessHints.VERY_LOW;
        } else if (miss < 0 && miss >= -1 * Parameters.GOOD_GUESS_THRESHOLD) {
            return GuessHints.HIGH;
        } else if (miss < 0) {
            return GuessHints.VERY_HIGH;
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
        if (!this.counts[round - 1] && round <= this.roundCount - 1) {
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
            const difference = Math.abs(this.counts[round - 1] - guesses[round - 1]);
            return { id, difference }
        }).sort((a, b) => (a.difference - b.difference));

        let newPoints = 3;
        differences.forEach((entry) => {
            const currentRank = this.playerRanks.get(entry.id);
            if (currentRank) {
                currentRank.points += newPoints;
                newPoints--;
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
