import Parameters from "../constants/Parameters";
import { Phases } from "../enums/Phases";
import RoundEventEmitter from "./RoundEventEmitter";
import { Timer } from 'timer-node';

export default class RoundService {
    private roundCount: number;
    public round: number;
    public phase: string;
    private roundEventEmitter: RoundEventEmitter;
    private timer: Timer;

    constructor() {
        this.roundCount = Parameters.ROUNDS;
        this.round = 1;
        this.phase = Phases.COUNTING;
        this.roundEventEmitter = RoundEventEmitter.getInstance();
        this.timer = new Timer();
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
        }, Parameters.PHASE_TIMES[Phases.COUNTING]);

    }

    public guessingPhase() {
        this.phase = Phases.GUESSING;
        this.emitRoundChange();

        this.timer.clear();
        this.timer.start();
        console.log(this.timer);
        setTimeout(() => {
            this.resultsPhase();
        }, Parameters.PHASE_TIMES[Phases.GUESSING]);

    }

    public resultsPhase() {
        this.phase = Phases.RESULTS;
        this.emitRoundChange();

        setTimeout(() => {
            this.round++;
            if (this.round <= this.roundCount) {
                this.countingPhase();
            }

        }, Parameters.PHASE_TIMES[Phases.RESULTS]);
    }

    private emitRoundChange(): void {
        this.roundEventEmitter.emit(RoundEventEmitter.PHASE_CHANGE_EVENT, this.round, this.phase);
    }

}
