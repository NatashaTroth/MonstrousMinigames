import { Timer } from 'timer-node';

import Parameters from "../constants/Parameters";
import { Phases } from "../enums/Phases";

import RoundEventEmitter from "./RoundEventEmitter";

const PHASES: string[] = [Phases.COUNTING, Phases.GUESSING, Phases.RESULTS];

export default class RoundService {
    private roundCount: number;
    public round: number;
    public phase: string;
    private roundEventEmitter: RoundEventEmitter;
    private timer: Timer;
    private timeout: NodeJS.Timer | null;

    constructor() {
        this.roundCount = Parameters.ROUNDS;
        this.round = 1;
        this.phase = Phases.COUNTING;
        this.roundEventEmitter = RoundEventEmitter.getInstance();
        this.timer = new Timer();
        this.timeout = null;
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

    public pause(): void {
        if(this.timeout){
            clearTimeout(this.timeout);
        }
    }
    
    public resume(): void {
        this.timeout = setTimeout(() =>  this.phaseAction(), this.getTimeLeft());
    }
    
    
    private runPhase(): void {
        this.emitRoundChange();

        this.timer.clear();
        this.timer.start();

        this.timeout = setTimeout(() =>  this.phaseAction(), Parameters.PHASE_TIMES[this.phase]);
    }

    private phaseAction(): void {
        this.timer.stop();
        if (this.phase === Phases.RESULTS) {
            if (!this.nextRound()) {
                return;
            }
        }
        this.nextPhase();
        this.runPhase();
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
        let pos = PHASES.indexOf(this.phase) + 1;
        if (pos === PHASES.length) {
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

    public skipPhase(): boolean {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.phaseAction();
            return true;
        }
        return false;
    }
}
