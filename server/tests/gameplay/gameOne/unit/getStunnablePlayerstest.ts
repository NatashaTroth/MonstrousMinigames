import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { ObstacleType } from '../../../../src/gameplay/gameOne/enums';
import { leaderboard, roomId } from '../../mockData';
import { clearTimersAndIntervals, startGameAndAdvanceCountdown } from '../gameOneHelperFunctions';

let gameOne: GameOne;
// let gameEventEmitter: GameOneEventEmitter;

describe('Stun player tests', () => {
    beforeEach(() => {
        // gameEventEmitter = GameOneEventEmitter.getInstance();
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
        startGameAndAdvanceCountdown(gameOne, () => {
            gameOne.players.get('2')!.obstacles = gameOne.players
                .get('2')!
                .obstacles.filter(obstacle => obstacle.type === ObstacleType.Stone);
            gameOne.players.get('2')!.stonesCarrying = 3;
        });
    });

    afterEach(() => {
        clearTimersAndIntervals(gameOne);
    });

    // const dateNow = 1618665766156;
    // Date.now = jest.fn(() => dateNow);
    // startGameAndAdvanceCountdown(gameOne);

    it('getStunnablePlayers returns players that can be stunned', async () => {
        //TODO test
        // const stunnablePlayersSpy = jest.spyOn(GameOne.prototype as any, 'getStunnablePlayers');
        // console.log('-----here');
        // gameOne.players.get('2')!.finished = true;
        // console.log(gameOne['getStunnablePlayers']());
    });
});
