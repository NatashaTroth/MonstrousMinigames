import 'reflect-metadata';

import { Countdown } from '../../../../src/gameplay/gameThree/classes/Countdown';

let countdown: Countdown;

const initialCountDownTime = 500;
const timeReduction = 50;

describe('Initiate Countdown', () => {
    beforeEach(() => {
        countdown = Countdown.getInstance(true);
    });

    it('should set countdownTimeLeft to the countdown time', async () => {
        countdown.initiateCountdown(initialCountDownTime);
        expect(countdown.countdownTimeLeft).toBe(initialCountDownTime);
    });

    it('should set countdownRunning to true', async () => {
        countdown.initiateCountdown(initialCountDownTime);
        expect(countdown.countdownRunning).toBeTruthy();
    });
});

describe('Reduce Countdown', () => {
    beforeEach(() => {
        countdown = Countdown.getInstance(true);
        countdown.countdownTimeLeft = initialCountDownTime;
    });

    it('should reduce the countdownTimeLeft by given time', async () => {
        countdown.reduceCountdown(timeReduction);
        expect(countdown.countdownTimeLeft).toBe(initialCountDownTime - timeReduction);
    });
});

describe('Stop Countdown', () => {
    beforeEach(() => {
        countdown = Countdown.getInstance(true);
        countdown.countdownTimeLeft = initialCountDownTime;
    });

    it('should set countdownTimeLeft to 0', async () => {
        countdown.resetCountdown();
        expect(countdown.countdownTimeLeft).toBe(0);
    });

    it('should set countdownRunning to false', async () => {
        countdown.resetCountdown();
        expect(countdown.countdownRunning).toBeFalsy();
    });
});

describe('Check if countdown is over', () => {
    beforeEach(() => {
        countdown = Countdown.getInstance(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return false', async () => {
        countdown.countdownTimeLeft = initialCountDownTime;
        expect(countdown.countdownOver()).toBeFalsy();
    });

    it('should return true', async () => {
        countdown.countdownTimeLeft = 0;
        expect(countdown.countdownOver()).toBeTruthy();
    });
});

describe('Update Countdown', () => {
    beforeEach(() => {
        countdown = Countdown.getInstance(true);
    });

    it('should not reduce countdown when no countdown is running', async () => {
        const spy = jest.spyOn(countdown, 'reduceCountdown');
        countdown.update(10);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should reduce countdown by timeElapsedSinceLastFrame when countdown is running', async () => {
        const initialTime = 3400;
        const timeElapsedSinceLastFrame = 10;
        const spy = jest.spyOn(countdown, 'reduceCountdown');

        countdown.initiateCountdown(initialTime);
        countdown.update(timeElapsedSinceLastFrame);
        expect(spy).toHaveBeenCalledWith(timeElapsedSinceLastFrame);
    });

    it('should not reset the countdown if it is not over', async () => {
        const initialTime = 3400;
        const spy = jest.spyOn(countdown, 'resetCountdown');
        countdown.initiateCountdown(initialTime);
        countdown.update(10);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should reset the countdown if it is over', async () => {
        const initialTime = 3400;
        const spy = jest.spyOn(countdown, 'resetCountdown');
        countdown.initiateCountdown(initialTime);
        countdown.update(initialTime);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
