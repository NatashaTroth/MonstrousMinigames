import { CatchFoodGame } from '../../../src/gameplay';
import { DisconnectedUserError } from '../../../src/gameplay/customErrors';
import { completeNextObstacle, startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;

describe('DisconnectedUserError handling tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
    });

    it('DisconnectedUserError has userId property of disconnected user', async () => {
        const SPEED = 50;
        const userId = '1';
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.runForward(userId, SPEED);
        catchFoodGame.disconnectPlayer(userId);

        try {
            catchFoodGame.runForward(userId);
        } catch (e) {
            expect(e.userId).toBe(userId);
        }
    });

    it('throws a DisconnectedUserError when runForward is called on a disconnected user', async () => {
        const SPEED = 50;
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.runForward('1', SPEED);
        catchFoodGame.disconnectPlayer('1');

        expect(() => catchFoodGame.runForward('1')).toThrow(DisconnectedUserError);
    });
    it('throws a DisconnectedUserError when trying to complete an obstacle when disconnected', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        completeNextObstacle(catchFoodGame, '1');
        catchFoodGame.disconnectPlayer('1');
        expect(() =>
            catchFoodGame.playerHasCompletedObstacle('1', catchFoodGame.playersState['1'].obstacles[0].id)
        ).toThrow(DisconnectedUserError);
    });
    it('throws a DisconnectedUserError when trying to disconnect an already disconnected user', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        expect(() => catchFoodGame.disconnectPlayer('1')).toThrow(DisconnectedUserError);
    });
});
