import 'reflect-metadata';

import { GameOne } from '../../../src/gameplay';
import { ObstacleType } from '../../../src/gameplay/gameOne/enums';
import { leaderboard, roomId } from '../mockData';
import { clearTimersAndIntervals, startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: GameOne;
// let gameEventEmitter: GameOneEventEmitter;

describe('Stun player tests', () => {
    beforeEach(() => {
        // gameEventEmitter = GameOneEventEmitter.getInstance();
        catchFoodGame = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
        startGameAndAdvanceCountdown(catchFoodGame, () => {
            catchFoodGame.players.get('2')!.obstacles = catchFoodGame.players
                .get('2')!
                .obstacles.filter(obstacle => obstacle.type === ObstacleType.Stone);
            catchFoodGame.players.get('2')!.stonesCarrying = 3;
        });
    });

    afterEach(() => {
        clearTimersAndIntervals(catchFoodGame);
    });

    // const dateNow = 1618665766156;
    // Date.now = jest.fn(() => dateNow);
    // startGameAndAdvanceCountdown(catchFoodGame);

    it('getStunnablePlayers returns players that can be stunned', async () => {
        //TODO test
        // const stunnablePlayersSpy = jest.spyOn(GameOne.prototype as any, 'getStunnablePlayers');
        // console.log('-----here');
        // catchFoodGame.players.get('2')!.finished = true;
        // console.log(catchFoodGame['getStunnablePlayers']());
    });
});
