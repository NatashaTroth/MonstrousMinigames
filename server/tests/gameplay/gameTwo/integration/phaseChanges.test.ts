import 'reflect-metadata';

import { leaderboard, roomId, usersWithNumbers } from '../../mockData';
import { GameTwo } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import Leaderboard from '../../../../src/gameplay/leaderboard/Leaderboard';
import GameTwoEventEmitter from '../../../../src/gameplay/gameTwo/classes/GameTwoEventEmitter';
import RoundEventEmitter from '../../../../src/gameplay/gameTwo/classes/RoundEventEmitter';
import Parameters from '../../../../src/gameplay/gameTwo/constants/Parameters';
import { Phases } from '../../../../src/gameplay/gameTwo/enums/Phases';

let gameTwo: GameTwo;
const users = usersWithNumbers;

describe('GameTwo Unit Tests', () => {
    beforeEach(async () => {
        jest.spyOn(console, "log").mockImplementation();
        gameTwo = new GameTwo(roomId, leaderboard);
        jest.useFakeTimers();

        gameTwo.createNewGame(users);
        gameTwo.startGame();
        jest.advanceTimersByTime(gameTwo.countdownTime);
    });

    afterEach(() => {
        jest.clearAllTimers();
        gameTwo.cleanup();
    });

    it('should have the right phase at the time', async () => {
        expect(gameTwo.getGameStateInfo().phase).toEqual(Phases.COUNTING);
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.COUNTING]);
        expect(gameTwo.getGameStateInfo().phase).toEqual(Phases.GUESSING);
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.GUESSING]);
        expect(gameTwo.getGameStateInfo().phase).toEqual(Phases.RESULTS);
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.RESULTS]);
        expect(gameTwo.getGameStateInfo().phase).toEqual(Phases.COUNTING);
    });

    it('should have the game state finished after the last result phase', async () => {
        for (let round = 1; round <= Parameters.ROUNDS; round++) {
            jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.COUNTING]);
            jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.GUESSING]);
            jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.RESULTS]);
        }
        expect(gameTwo.getGameStateInfo().gameState).toEqual(GameState.Finished);
    });
});
