import InitialParameters from "../constants/InitialParameters";
import { Phases } from "../enums/Phases";

export default class RoundService {
    private roundCount: number;
    private round: number;
    private phase: string;
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

    public getRound(){
        return this.round;
    }
    public getPhase(){
        return this.phase;
    }

    protected logPhaseInfo(){
        console.log('Round: ' + this.round + ' | Phase: ' + this.phase);
    }

    public countingPhase() {
        this.phase = Phases.COUNTING;
        this.logPhaseInfo();
        //todo emit
        setTimeout(() => {
            this.guessingPhase();
        }, this.roundTime);

    }

    public guessingPhase() {
        this.phase = Phases.GUESSING;
        this.logPhaseInfo();
        //todo emit
        setTimeout(() => {
            this.resultsPhase();
        }, this.guessingTime);

    }

    public resultsPhase() {
        this.phase = Phases.RESULTS;
        this.logPhaseInfo();
        //todo emit

        setTimeout(() => {
            this.round++;
            if (this.round <= this.roundCount) {
                this.countingPhase();
            }

        }, this.resultsTime);
    }
    
}
