import 'reflect-metadata';

import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;

const initialCountDownTime = 500;
const timeReduction = 50;

describe('Initiate Countdown', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    it('should set countdownTimeLeft to the countdown time', async () => {
        gameThree['initiateCountdown'](initialCountDownTime);
        expect(gameThree['countdownTimeLeft']).toBe(initialCountDownTime);
    });

    it('should set countdownRunning to true', async () => {
        gameThree['initiateCountdown'](initialCountDownTime);
        expect(gameThree['countdownRunning']).toBeTruthy();
    });
});

describe('Reduce Countdown', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree['countdownTimeLeft'] = initialCountDownTime;
    });

    it('should reduce the countdownTimeLeft by given time', async () => {
        gameThree['reduceCountdown'](timeReduction);
        expect(gameThree['countdownTimeLeft']).toBe(initialCountDownTime - timeReduction);
    });
});

describe('Stop Countdown', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree['countdownTimeLeft'] = initialCountDownTime;
    });

    it('should set countdownTimeLeft to 0', async () => {
        gameThree['stopCountdown']();
        expect(gameThree['countdownTimeLeft']).toBe(0);
    });

    it('should set countdownRunning to false', async () => {
        gameThree['stopCountdown']();
        expect(gameThree['countdownRunning']).toBeFalsy();
    });
});

describe('Check if countdown is over', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    it('should return false', async () => {
        gameThree['countdownTimeLeft'] = initialCountDownTime;
        expect(gameThree['countdownOver']()).toBeFalsy();
    });

    it('should return true', async () => {
        gameThree['countdownTimeLeft'] = 0;
        expect(gameThree['countdownOver']()).toBeTruthy();
    });
});
