import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import {
    advanceCountdown, clearTimersAndIntervals, finishPlayer, releaseThreadN
} from '../gameOneHelperFunctions';
import { runForwardMessage } from '../gameOneMockData';

let gameOne: GameOne;
const InitialGameParameters = getInitialParams();

describe('Chasers', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.startGame();
        advanceCountdown(gameOne, gameOne.countdownTime);
    });
    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('moves the chasers after time passes', async () => {
        const initialChasersPositionX = gameOne.chasers!.getPosition();
        advanceCountdown(gameOne, 500);
        await releaseThreadN(1);
        expect(gameOne.chasers!.getPosition()).toBeGreaterThan(initialChasersPositionX);
    });

    it('should test that the game stops when only one player was not caught', async () => {
        for (let i = 0; i < users.length - 1; i++) {
            gameOne.players.get(users[i].id)!.positionX = 0;
        }

        advanceCountdown(gameOne, 1000);
        expect(gameOne.gameState).toBe(GameState.Finished);
    });

    it('have the last rank when first to be caught', async () => {
        gameOne.players.get(users[0].id)!.positionX = 0;
        for (let i = 1; i < users.length; i++) {
            gameOne.receiveInput({ ...runForwardMessage, userId: users[i].id });
        }
        advanceCountdown(gameOne, 100);
        expect([...gameOne.gameOnePlayersController!.getPlayerValues()][0].rank).toBe(users.length);
    });

    it('should test that all players have rank 1 when all caught at the same time', async () => {
        advanceCountdown(gameOne, 7000);
        const players = [...gameOne.gameOnePlayersController!.getPlayerValues()];
        expect(players[0].rank).toBe(1);
        expect(players[1].rank).toBe(1);
        expect(players[2].rank).toBe(1);
        expect(players[3].rank).toBe(1);
    });

    it('should test that all players have the correct ranks when 2 are caught', async () => {
        Date.now = jest.fn(() => dateNow);

        //first 2 players should be caught
        gameOne.players.get(users[0].id)!.positionX = 0; //should be 4th (caught first)
        advanceCountdown(gameOne, 100);

        Date.now = jest.fn(() => dateNow + 3000);
        gameOne.players.get(users[1].id)!.positionX = 0; //should be 3rd (caught second)
        advanceCountdown(gameOne, 100);

        //last 2 players should finish naturally
        Date.now = jest.fn(() => dateNow + 4000);
        finishPlayer(gameOne, users[2].id);

        Date.now = jest.fn(() => dateNow + 5000);
        finishPlayer(gameOne, users[3].id); // should be 2nd

        expect(gameOne.players.get(users[0].id)!.rank).toBe(4);
        expect(gameOne.players.get(users[1].id)!.rank).toBe(3);
        expect(gameOne.players.get(users[2].id)!.rank).toBe(1);
        expect(gameOne.players.get(users[3].id)!.rank).toBe(2);
    });

    it('should test that players have the correct ranks, when player finishes before someone is caught', async () => {
        Date.now = jest.fn(() => dateNow);

        //first player should finish naturally
        finishPlayer(gameOne, users[3].id); // should be 1st (fastest to finish)

        //first 2 players should be caught
        gameOne.players.get(users[0].id)!.positionX = 0; //should be 4th (caught first)
        advanceCountdown(gameOne, 100);

        Date.now = jest.fn(() => dateNow + 3000);
        gameOne.players.get(users[1].id)!.positionX = 0; //should be 3rd (caught second)
        advanceCountdown(gameOne, 100);

        //last player should finish automatically
        expect(gameOne.players.get(users[0].id)!.rank).toBe(4);
        expect(gameOne.players.get(users[1].id)!.rank).toBe(3);
        expect(gameOne.players.get(users[2].id)!.rank).toBe(2);
        expect(gameOne.players.get(users[3].id)!.rank).toBe(1);
    });
});
