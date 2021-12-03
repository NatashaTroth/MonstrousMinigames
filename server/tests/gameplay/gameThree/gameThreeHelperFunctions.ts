import { GameThree } from '../../../src/gameplay';
import InitialParameters from '../../../src/gameplay/gameThree/constants/InitialParameters';

export function startGameAdvanceCountdown(gameThree: GameThree) {
    gameThree.startGame();
    jest.advanceTimersByTime(InitialParameters.COUNTDOWN_TIME_GAME_START);
    // advanceCountdown(gameThree['countdownTimeGameStart']);
}

export function advanceCountdown(gameThree: GameThree, time: number) {
    gameThree['update'](10, time);
    //Todo change to update time - not call update function - not working - update is being called after expect (look at stun test)
    // await advanceCountdown(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
    // await releaseThread();
}
