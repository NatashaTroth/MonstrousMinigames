import InitialParameters from "../constants/InitialParameters";
import { Phases } from "../enums/Phases";

export default class RoundService {
    private roundCount: number;
    public round: number;
    public phase: string;
    private roundTime: number;
    private guessingTime: number;
    private resultsTime: number;

    constructor() {
        this.roundCount = InitialParameters.ROUNDS;
        this.roundTime = InitialParameters.ROUND_TIME;
        this.guessingTime = InitialParameters.GUESSING_TIME;
        this.resultsTime = InitialParameters.RESULTS_TIME;
        this.round = 1;
        this.phase = Phases.COUNTING;
    }

    public isCountingPhase(): boolean {
        return this.phase === Phases.COUNTING;
    }

    public isGuessingPhase(): boolean {
        return this.phase === Phases.GUESSING;
    }

    public isResultsPhase(): boolean {
        return this.phase === Phases.RESULTS;
    }

    public countingPhase() {
        this.phase = Phases.COUNTING;

        setTimeout(() => {
            this.guessingPhase();
        }, this.roundTime);

    }

    public guessingPhase() {
        this.phase = Phases.GUESSING;

        setTimeout(() => {
            this.resultsPhase();
        }, this.guessingTime);

    }

    public resultsPhase() {
        this.phase = Phases.RESULTS;

        setTimeout(() => {
            this.round++;
            if (this.round <= this.roundCount) {
                this.countingPhase();
            }

        }, this.resultsTime);
    }

}
