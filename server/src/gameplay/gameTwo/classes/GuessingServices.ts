import User from "../../../classes/user";
import InitialParameters from "../constants/InitialParameters";
import { GuessHints } from "../enums/GuessHints";

export default class GuessingService {
    private roundCount: number;
    public counts: number[];
    public guesses: Map<string, number[]>

    constructor(roundCount: number) {
        this.roundCount = roundCount;
        this.counts = new Array(roundCount);
        this.guesses = new Map<string, number[]>();
    }

    public init(users: User[]): void {
        users.forEach(user => {
            this.guesses.set(user.id, new Array(this.roundCount));
        })
        console.log(this.guesses);
    }


    public getHint(miss: number): string {
        if (miss > 0 && miss <= InitialParameters.GOOD_GUESS_THRESHOLD) {
            return GuessHints.LOW;
        } else if (miss > 0) {
            return GuessHints.VERY_LOW;
        } else if (miss < 0 && miss >= -1 * InitialParameters.GOOD_GUESS_THRESHOLD) {
            return GuessHints.HIGH;
        } else if (miss < 0) {
            return GuessHints.VERY_HIGH;
        } else {
            return GuessHints.EXACT;
        }
    }
}
