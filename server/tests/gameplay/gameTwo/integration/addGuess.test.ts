import 'reflect-metadata';

import { leaderboard, roomId } from '../../mockData';
import { GameTwo } from '../../../../src/gameplay';
import User from '../../../../src/classes/user';
import GameTwoEventEmitter from '../../../../src/gameplay/gameTwo/classes/GameTwoEventEmitter';
import Parameters from '../../../../src/gameplay/gameTwo/constants/Parameters';
import { GameTwoMessageTypes } from '../../../../src/gameplay/gameTwo/enums/GameTwoMessageTypes';
import { Phases } from '../../../../src/gameplay/gameTwo/enums/Phases';

let gameTwo: GameTwo;

const users = [new User('ABCD', '72374', 'Franz', 1, '1', 1),
new User('ABCD', '345345', 'Sissi', 2, '2', 2)];


describe('GameTwo Guessing Tests', () => {
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

    it('should send a guess hint event on a received guess', async () => {
        const message = {
            type: GameTwoMessageTypes.GUESS,
            roomId: roomId,
            userId: users[0].id,
            guess: 10
        }
        jest.useFakeTimers();
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.COUNTING])

        const emitGuessHint = jest.spyOn(GameTwoEventEmitter, "emitGuessHint");
        gameTwo.receiveInput(message);

        expect(emitGuessHint).toHaveBeenCalled();
        emitGuessHint.mockClear();
    });

    it('should only emit one guess hint if multiple guesses are sent', async () => {
        const message = {
            type: GameTwoMessageTypes.GUESS,
            roomId: roomId,
            userId: users[0].id,
            guess: 10
        }
        jest.useFakeTimers();
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.COUNTING])


        const emitGuessHint = jest.spyOn(GameTwoEventEmitter, "emitGuessHint");
        gameTwo.receiveInput(message);
        gameTwo.receiveInput(message);
        gameTwo.receiveInput(message);


        expect(emitGuessHint).toHaveBeenCalledTimes(1);
        emitGuessHint.mockClear();
    });

    it('should not send a guess hint if it is not guessing phase', async () => {
        const message = {
            type: GameTwoMessageTypes.GUESS,
            roomId: roomId,
            userId: users[0].id,
            guess: 10
        }
        jest.useFakeTimers();
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.COUNTING])
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.GUESSING])


        const emitGuessHint = jest.spyOn(GameTwoEventEmitter, "emitGuessHint");
        gameTwo.receiveInput(message);

        expect(emitGuessHint).not.toHaveBeenCalled();
        emitGuessHint.mockClear();
    });

    it('should skip the guessing phase if all players submitted their guess', async () => {
        let message = {
            type: GameTwoMessageTypes.GUESS,
            roomId: roomId,
            userId: users[0].id,
            guess: 10
        }

        jest.useFakeTimers();
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.COUNTING] + 10)

        gameTwo.receiveInput(message);

        message = {
            type: GameTwoMessageTypes.GUESS,
            roomId: roomId,
            userId: users[1].id,
            guess: 15
        }
        expect(gameTwo.getGameStateInfo().phase).toEqual(Phases.GUESSING);

        gameTwo.receiveInput(message);

        expect(gameTwo.getGameStateInfo().phase).toEqual(Phases.RESULTS);

    });
});
