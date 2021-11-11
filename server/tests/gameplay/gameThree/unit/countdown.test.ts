import 'reflect-metadata';

import { Countdown } from '../../../../src/gameplay/gameThree/classes/Countdown';

let countdown: Countdown;

const initialCountDownTime = 500;
const timeReduction = 50;

describe('Initiate Countdown', () => {
    beforeEach(() => {
        countdown = new Countdown(
            jest.fn(() => {
                /*do nothing */
            })
        );
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
        countdown = new Countdown(
            jest.fn(() => {
                /*do nothing */
            })
        );
        countdown.countdownTimeLeft = initialCountDownTime;
    });

    it('should reduce the countdownTimeLeft by given time', async () => {
        countdown.reduceCountdown(timeReduction);
        expect(countdown.countdownTimeLeft).toBe(initialCountDownTime - timeReduction);
    });
});

describe('Stop Countdown', () => {
    beforeEach(() => {
        countdown = new Countdown(
            jest.fn(() => {
                /*do nothing */
            })
        );
        countdown.countdownTimeLeft = initialCountDownTime;
    });

    it('should set countdownTimeLeft to 0', async () => {
        countdown.stopCountdown();
        expect(countdown.countdownTimeLeft).toBe(0);
    });

    it('should set countdownRunning to false', async () => {
        countdown.stopCountdown();
        expect(countdown.countdownRunning).toBeFalsy();
    });
});

describe('Check if countdown is over', () => {
    beforeEach(() => {
        countdown = new Countdown(
            jest.fn(() => {
                /*do nothing */
            })
        );
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
