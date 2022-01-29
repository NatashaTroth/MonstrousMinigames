import User from '../../../src/classes/user';
import { GameThree } from '../../../src/gameplay';
import { StageController } from '../../../src/gameplay/gameThree/classes/StageController';
import InitialParameters from '../../../src/gameplay/gameThree/constants/InitialParameters';

export function startGameAdvanceCountdown(gameThree: GameThree) {
    gameThree.startGame();
    jest.advanceTimersByTime(InitialParameters.COUNTDOWN_TIME_GAME_START);
}

export function advanceCountdown(gameThree: GameThree, time: number) {
    gameThree['update'](10, time);
    //Todo change to update time - not call update function - not working - update is being called after expect (look at stun test)
    // await advanceCountdown(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME);
    // await releaseThread();
}

export function switchToSecondToLastRound(gameObject: StageController | GameThree) {
    let stageController: StageController;
    if (gameObject instanceof StageController) stageController = gameObject;
    else stageController = getStageControllerFromGameObject(gameObject)!;

    switchRound(stageController, InitialParameters.NUMBER_ROUNDS - 1);
}

export function switchRound(stageController: StageController, roundNumber: number) {
    stageController['roundIdx'] = roundNumber;
}

export function startNewRound(gameThree: GameThree) {
    getStageControllerFromGameObject(gameThree)?.handleNewRound();
}

export function addPointsToPlayer(gameThree: GameThree, users: User[]) {
    const pointsArray: number[] = [];
    const stageController = getStageControllerFromGameObject(gameThree);
    if (!stageController) return [];
    const playerPointsObject = stageController['playerPoints'];
    // to test final points calculations
    users.forEach((user, idx) => {
        pointsArray.push(playerPointsObject.getPointsFromPlayer(user.id)); // get points from before (from sending final photo)
        for (let i = 0; i < InitialParameters.NUMBER_ROUNDS; i++) {
            playerPointsObject.addPointsToPlayer(user.id, idx);
            pointsArray[idx] += idx;
        }
    });
    return pointsArray;
}

function getStageControllerFromGameObject(gameThree: GameThree) {
    return gameThree['stageController'];
}
