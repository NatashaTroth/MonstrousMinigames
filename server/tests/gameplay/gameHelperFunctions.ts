/* istanbul ignore file */
import { MockGameClass } from './mockGameClass';

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
