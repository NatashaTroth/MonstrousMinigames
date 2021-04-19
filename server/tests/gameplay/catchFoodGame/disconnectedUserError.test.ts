import { CatchFoodGame } from '../../../src/gameplay';
import { DisconnectedUserError } from '../../../src/gameplay/customErrors';
import { startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;

describe('DisconnectedUserError handling tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
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
        catchFoodGame.playerHasCompletedObstacle('1', catchFoodGame.playersState['1'].obstacles[0].id);
        catchFoodGame.disconnectPlayer('1');
        expect(() =>
            catchFoodGame.playerHasCompletedObstacle('1', catchFoodGame.playersState['1'].obstacles[0].id)
        ).toThrow(DisconnectedUserError);
    });
});
