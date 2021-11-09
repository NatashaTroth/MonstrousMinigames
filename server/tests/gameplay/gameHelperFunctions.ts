/* istanbul ignore file */
import { dateNow } from './mockData';
import { MockGameClass } from './mockGameClass';

Date.now = () => dateNow;

export const releaseThread = () => new Promise<void>(resolve => resolve());
export const releaseThreadN = async (n: number) => {
    for (let i = 0; i < n; i++) {
        await releaseThread();
    }
};

export function clearTimersAndIntervals(game: MockGameClass) {
    //to clear intervals
    jest.advanceTimersByTime(3000 || 0);
    // jest.advanceTimersByTime(gameOne.timeOutLimit);
    try {
        game.stopGameUserClosed();
    } catch (e) {
        //no need to handle, game is already finished
    }
    // jest.runAllTimers();
    jest.clearAllMocks();
}

export function advanceCountdown(time: number) {
    //run countdown
    const previousNow = Date.now;
    Date.now = () => previousNow() + time;
    jest.advanceTimersByTime(time);
}
