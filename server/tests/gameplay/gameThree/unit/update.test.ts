import 'reflect-metadata';

import { GameState } from '../../../../src/gameplay/enums';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;
const initialCountDownTime = 500;
const timeElapsed = 50;

describe('Update method', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.gameState = GameState.Started;
        gameThree['countdown'].countdownRunning = true;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    xit('should update the countdown time if a countdown is running', async () => {
        gameThree['countdown'].countdownTimeLeft = initialCountDownTime;
        gameThree['update'](100, timeElapsed);
        expect(gameThree['countdown'].countdownTimeLeft).toBe(initialCountDownTime - timeElapsed);
    });

    xit('should call handleFinishedTakingPhoto if the gameThreeGameState is TakingPhoto and countdown is over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleFinishedTakingPhoto').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['stageController'].stage = GameThreeGameState.TakingPhoto;
        // gameThree['countdown'].countdownTimeLeft = 0
        gameThree['update'](100, timeElapsed);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    xit('should not call handleFinishedTakingPhoto if the gameThreeGameState is TakingPhoto and countdown is not over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleFinishedTakingPhoto').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['stageController'].stage = GameThreeGameState.TakingPhoto;
        gameThree['countdown'].countdownTimeLeft = initialCountDownTime;
        gameThree['update'](100, timeElapsed);
        expect(spy).not.toHaveBeenCalled();
    });

    xit('should call handleFinishedVoting if the gameThreeGameState is Voting and countdown is over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleFinishedVoting').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['stageController'].stage = GameThreeGameState.Voting;
        gameThree['update'](100, timeElapsed);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    xit('should not call handleFinishedVoting if the gameThreeGameState is Voting and countdown is not over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleFinishedVoting').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['stageController'].stage = GameThreeGameState.Voting;
        gameThree['countdown'].countdownTimeLeft = initialCountDownTime;
        gameThree['update'](100, timeElapsed);
        expect(spy).not.toHaveBeenCalled();
    });

    xit('should call handleNewRound if the gameThreeGameState is ViewingResults and countdown is over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleNewRound').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['stageController'].stage = GameThreeGameState.ViewingResults;
        gameThree['update'](100, timeElapsed);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    xit('should not call handleNewRound if the gameThreeGameState is ViewingResults and countdown is not over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleNewRound').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['stageController'].stage = GameThreeGameState.ViewingResults;
        gameThree['countdown'].countdownTimeLeft = initialCountDownTime;
        gameThree['update'](100, timeElapsed);
        expect(spy).not.toHaveBeenCalled();
    });
});
