import RoundService from "../../../../src/gameplay/gameTwo/classes/RoundService";
import Parameters from "../../../../src/gameplay/gameTwo/constants/Parameters";
import { Phases } from "../../../../src/gameplay/gameTwo/enums/Phases";


let roundService: RoundService;
describe('RoundService Tests', () => {
    beforeEach(() => {
        roundService = new RoundService();
    });


    afterEach(() => {
        jest.useRealTimers();
    });


    it('should have the counting phase as the initial phase', () => {
        expect(roundService.isCountingPhase()).toBeTruthy();
    });

    it('isGuessingPhase should return false if the phase is not guessing', () => {
        expect(roundService.isGuessingPhase()).toBeFalsy();
    });

    it('isResultsPhase should return false if the phase is not results', () => {
        expect(roundService.isResultsPhase()).toBeFalsy();
    });

    it('getTimeLeft should return the same time as the counting phase time', () => {
        expect(roundService.getTimeLeft()).toEqual(Parameters.PHASE_TIMES[Phases.COUNTING]);
    });

    it('should have the maximum amount of rounds after running through every phase', () => {
        jest.useFakeTimers();
        roundService.start();
        jest.runAllTimers();
        expect(roundService.round).toEqual(Parameters.ROUNDS);
    });

    it('should be in the counting phase again after running through all phases', () => {
        jest.useFakeTimers();
        roundService.start();

        jest.useFakeTimers();
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.COUNTING]);
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.GUESSING]);
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.RESULTS]);

        expect(roundService.phase).toEqual(Phases.COUNTING);
    });
});