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
        gameThree['countdownRunning'] = true;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the countdown time if a countdown is running', async () => {
        gameThree['countdownTimeLeft'] = initialCountDownTime;
        gameThree['update'](100, timeElapsed);
        expect(gameThree['countdownTimeLeft']).toBe(initialCountDownTime - timeElapsed);
    });

    it('should call handleTakingPhoto if the gameThreeGameState is TakingPhoto and countdown is over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleTakingPhoto').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['gameThreeGameState'] = GameThreeGameState.TakingPhoto;
        // gameThree['countdownTimeLeft'] = 0
        gameThree['update'](100, timeElapsed);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call handleTakingPhoto if the gameThreeGameState is TakingPhoto and countdown is not over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleTakingPhoto').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['gameThreeGameState'] = GameThreeGameState.TakingPhoto;
        gameThree['countdownTimeLeft'] = initialCountDownTime;
        gameThree['update'](100, timeElapsed);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call handleVoting if the gameThreeGameState is Voting and countdown is over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleVoting').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['gameThreeGameState'] = GameThreeGameState.Voting;
        gameThree['update'](100, timeElapsed);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call handleVoting if the gameThreeGameState is Voting and countdown is not over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleVoting').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['gameThreeGameState'] = GameThreeGameState.Voting;
        gameThree['countdownTimeLeft'] = initialCountDownTime;
        gameThree['update'](100, timeElapsed);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call handleNewRound if the gameThreeGameState is ViewingResults and countdown is over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleNewRound').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['gameThreeGameState'] = GameThreeGameState.ViewingResults;
        gameThree['update'](100, timeElapsed);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call handleNewRound if the gameThreeGameState is ViewingResults and countdown is not over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleNewRound').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree['gameThreeGameState'] = GameThreeGameState.ViewingResults;
        gameThree['countdownTimeLeft'] = initialCountDownTime;
        gameThree['update'](100, timeElapsed);
        expect(spy).not.toHaveBeenCalled();
    });
});
