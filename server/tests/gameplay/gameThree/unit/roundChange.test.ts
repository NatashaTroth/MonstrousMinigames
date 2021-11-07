import 'reflect-metadata';

import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;

describe('Handle new round', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should increase the roundIdx', async () => {
        const roundIdx = gameThree['roundIdx'];

        gameThree['handleNewRound']();
        expect(gameThree['roundIdx']).toBe(roundIdx + 1);
    });

    it('should call sendPhotoTopic when it is not the final round', async () => {
        gameThree['roundIdx'] = 0;
        const spy = jest.spyOn(GameThree.prototype as any, 'sendPhotoTopic');

        gameThree['handleNewRound']();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call sendTakeFinalPhotosCountdown when it is the final round', async () => {
        gameThree['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        const spy = jest.spyOn(GameThree.prototype as any, 'sendTakeFinalPhotosCountdown');

        gameThree['handleNewRound']();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('Is final round', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when it is the final round', async () => {
        gameThree['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        expect(gameThree['isFinalRound']()).toBeTruthy();
    });

    it('should return false when it is the final round', async () => {
        gameThree['roundIdx'] = 0;
        expect(gameThree['isFinalRound']()).toBeFalsy();
    });
});
