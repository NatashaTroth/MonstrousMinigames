import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import * as InitialGameParameters from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import {
    advanceCountdown, clearTimersAndIntervals, releaseThreadN
} from '../gameOneHelperFunctions';

let gameOne: GameOne;

describe('Chasers', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.startGame();
        advanceCountdown(gameOne.countdownTime);
    });
    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('moves the chasers after time passes', async () => {
        const initialChasersPositionX = gameOne.chasersPositionX;
        advanceCountdown(500);
        await releaseThreadN(1);
        expect(gameOne.chasersPositionX).toBeGreaterThan(initialChasersPositionX);
    });

    it('should test that the game stops when only one player was not caught', async () => {
        for (let i = 0; i < users.length - 1; i++) {
            gameOne.players.get(users[i].id)!.positionX = 0;
        }

        gameOne.chasersPositionX = InitialGameParameters.CHASERS_POSITION_X;
        gameOne['updateChasersPosition'](100);

        expect(gameOne.gameState).toBe(GameState.Finished);
    });

    it('have the last rank when first to be caught', async () => {
        gameOne.players.get(users[0].id)!.positionX = 0;
        gameOne['updateChasersPosition'](100);
        expect(gameOne.players.get(users[0].id)!.rank).toBe(users.length);
    });

    it('should test that all players have rank 1 when all caught at the same time', async () => {
        users.forEach(user => {
            gameOne.players.get(user.id)!.positionX = 0;
        });
        gameOne['updateChasersPosition'](100);
        users.forEach(user => {
            gameOne.players.get(user.id)!.rank = 1;
        });
    });

    it('should test that all players have the correct ranks when 2 are caught', async () => {
        Date.now = jest.fn(() => dateNow);

        //first 2 players should be caught
        gameOne.players.get(users[0].id)!.positionX = 0; //should be 4th (caught first)
        gameOne['updateChasersPosition'](100);

        Date.now = jest.fn(() => dateNow + 3000);
        gameOne.players.get(users[1].id)!.positionX = 0; //should be 3rd (caught second)
        gameOne['updateChasersPosition'](100);

        //last 2 players should finish naturally
        Date.now = jest.fn(() => dateNow + 4000);
        gameOne['playerHasFinishedGame'](users[2].id); // should be 1st (fastest to finish)
        Date.now = jest.fn(() => dateNow + 5000);
        gameOne['playerHasFinishedGame'](users[3].id); // should be 2nd

        expect(gameOne.players.get(users[0].id)!.rank).toBe(4);
        expect(gameOne.players.get(users[1].id)!.rank).toBe(3);
        expect(gameOne.players.get(users[2].id)!.rank).toBe(1);
        expect(gameOne.players.get(users[3].id)!.rank).toBe(2);
    });

    it('should test that players have the correct ranks, when player finishes before someone is caught', async () => {
        Date.now = jest.fn(() => dateNow);

        //first player should finish naturally
        gameOne['playerHasFinishedGame'](users[3].id); // should be 1st (fastest to finish)

        //first 2 players should be caught
        gameOne.players.get(users[0].id)!.positionX = 0; //should be 4th (caught first)
        gameOne['updateChasersPosition'](100);

        Date.now = jest.fn(() => dateNow + 3000);
        gameOne.players.get(users[1].id)!.positionX = 0; //should be 3rd (caught second)
        gameOne['updateChasersPosition'](100);

        //last player should finish naturally
        Date.now = jest.fn(() => dateNow + 4000);
        gameOne['playerHasFinishedGame'](users[2].id); // should be 2nd

        expect(gameOne.players.get(users[0].id)!.rank).toBe(4);
        expect(gameOne.players.get(users[1].id)!.rank).toBe(3);
        expect(gameOne.players.get(users[2].id)!.rank).toBe(2);
        expect(gameOne.players.get(users[3].id)!.rank).toBe(1);
    });
});
