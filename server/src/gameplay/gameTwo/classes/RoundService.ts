import InitialParameters from "../constants/InitialParameters";
import { Phases } from "../enums/Phases";
import RoundEventEmitter from "./RoundEventEmitter";


export default class RoundService {
    private roundCount: number;
    public round: number;
    public phase: string;
    private roundTime: number;
    private guessingTime: number;
    private resultsTime: number;
    private roundEventEmitter: RoundEventEmitter;

    constructor() {
        this.roundCount = InitialParameters.ROUNDS;
        this.roundTime = InitialParameters.COUNTING_TIME;
        this.guessingTime = InitialParameters.GUESSING_TIME;
        this.resultsTime = InitialParameters.RESULTS_TIME;
        this.round = 1;
        this.phase = Phases.COUNTING;
        this.roundEventEmitter = RoundEventEmitter.getInstance();
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
        this.emitRoundChange();

        setTimeout(() => {
            this.guessingPhase();
        }, this.roundTime);

    }

    public guessingPhase() {
        this.phase = Phases.GUESSING;
        this.emitRoundChange();

        setTimeout(() => {
            this.resultsPhase();
        }, this.guessingTime);

    }

    public resultsPhase() {
        this.phase = Phases.RESULTS;
        this.emitRoundChange();

        setTimeout(() => {
            this.round++;
            if (this.round <= this.roundCount) {
                this.countingPhase();
            }

        }, this.resultsTime);
    }

    private emitRoundChange(): void {
        this.roundEventEmitter.emit(RoundEventEmitter.PHASE_CHANGE_EVENT, this.round, this.phase);
    }

}
