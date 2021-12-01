import Parameters from "../constants/Parameters";
import { Phases } from "../enums/Phases";
import RoundEventEmitter from "./RoundEventEmitter";
import { Timer } from 'timer-node';

const PHASES: string[] = [Phases.COUNTING, Phases.GUESSING, Phases.RESULTS];

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

    public start(): void {
        this.runPhase();
    }
    private runPhase(): void {
        this.emitRoundChange();

        this.timer.clear();
        this.timer.start();

        setTimeout(() => {
            this.timer.stop();
            if (this.phase === Phases.RESULTS) {
                if (!this.nextRound()) {
                    return;
                }
            }
            this.nextPhase();
            this.runPhase();

        }, Parameters.PHASE_TIMES[this.phase]);
    }

    private nextRound() {
        if (this.round + 1 <= this.roundCount) {
            this.round++;
            return true;
        } else {
            return false;
        }
    }

    private nextPhase() {
        let pos = PHASES.indexOf(this.phase);
        if (pos++ === PHASES.length) {
            pos = 0;
        }
        this.phase = PHASES[pos]
    }

    private emitRoundChange(): void {
        this.roundEventEmitter.emit(RoundEventEmitter.PHASE_CHANGE_EVENT, this.round, this.phase);
    }


    public getTimeLeft(): number {
        return Parameters.PHASE_TIMES[this.phase] - this.timer.ms();
    }
}
