import 'reflect-metadata';

import { CatchFoodGame } from '../../../src/gameplay';
import { ObstacleType } from '../../../src/gameplay/catchFood/enums';
import { leaderboard, roomId } from '../mockData';
import { clearTimersAndIntervals, startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
// let gameEventEmitter: CatchFoodGameEventEmitter;

describe('Stun player tests', () => {
    beforeEach(() => {
        // gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
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
        // const stunnablePlayersSpy = jest.spyOn(CatchFoodGame.prototype as any, 'getStunnablePlayers');
        // console.log('-----here');
        // catchFoodGame.players.get('2')!.finished = true;
        // console.log(catchFoodGame['getStunnablePlayers']());
    });
});
