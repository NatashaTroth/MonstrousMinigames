import { CatchFoodGame } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId } from '../mockData';
import {
    clearTimersAndIntervals, completeNextObstacle, completePlayersObstacles, finishPlayer,
    getGameFinishedDataDifferentTimes, startAndFinishGameDifferentTimes,
    startGameAndAdvanceCountdown
} from './gameHelperFunctions';

const TRACKLENGTH = 500;

let catchFoodGame: CatchFoodGame;
const dateNow = 1618665766156;

describe('Start game', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('starts players at initial positionX', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        expect(catchFoodGame.players.get('1')?.positionX).toBe(catchFoodGame.initialPlayerPositionX);
    });

    it('gameStartedTime is now', async () => {
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        // const afterCountdownTime = Date.now();
        // advanceCountdown(50);
        //Remove last 2 digits (could be slight difference)
        expect(catchFoodGame['_gameStartedAt']).toBe(Date.now());
    });
});

describe('Run forward', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('moves players forward when runForward is called', async () => {
        const SPEED = 10;
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame['runForward']('1', SPEED);
        expect(catchFoodGame.players.get('1')?.positionX).toBe(catchFoodGame.initialPlayerPositionX + SPEED);
    });

    it('moves players forward correctly when runForward is called multiple times', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame['runForward']('1', 10);
        catchFoodGame['runForward']('1', 5);
        expect(catchFoodGame.players.get('1')?.positionX).toBe(catchFoodGame.initialPlayerPositionX + 15);
    });
});

describe('Obstacles reached', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('playerHasReachedObstacle is called and returns false', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const playerHasReachedObstacleSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasReachedObstacle');
        catchFoodGame['runForward']('1', catchFoodGame.players.get('1')!.obstacles[0].positionX / 2);
        expect(playerHasReachedObstacleSpy).toHaveBeenCalled();
        expect(playerHasReachedObstacleSpy).toHaveReturnedWith(false);
    });

    it('recognises when player has reached an obstacle', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const distanceToObstacle =
            catchFoodGame.players.get('1')!.obstacles[0].positionX - catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', distanceToObstacle);
        expect(catchFoodGame.players.get('1')!.atObstacle).toBeTruthy();
    });

    it('playerHasReachedObstacle is called and returns true', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const distanceToObstacle =
            catchFoodGame.players.get('1')!.obstacles[0].positionX - catchFoodGame.players.get('1')!.positionX;
        const playerHasReachedObstacleSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasReachedObstacle');
        catchFoodGame['runForward']('1', distanceToObstacle);
        expect(playerHasReachedObstacleSpy).toHaveBeenCalled();
        expect(playerHasReachedObstacleSpy).toHaveReturnedWith(true);
    });

    it('handlePlayerReachedObstacle is called', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const distanceToObstacle =
            catchFoodGame.players.get('1')!.obstacles[0].positionX - catchFoodGame.players.get('1')!.positionX;
        const handlePlayerReachedObstacleSpy = jest.spyOn(
            CatchFoodGame.prototype as any,
            'handlePlayerReachedObstacle'
        );
        catchFoodGame['runForward']('1', distanceToObstacle);
        expect(handlePlayerReachedObstacleSpy).toHaveBeenCalled();
    });

    it("doesn't remove an obstacle when a player arrives at it", async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const distanceToObstacle =
            catchFoodGame.players.get('1')!.obstacles[0].positionX - catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', distanceToObstacle);
        expect(catchFoodGame.players.get('1')!.obstacles.length).toBe(catchFoodGame.numberOfObstacles + catchFoodGame.numberOfStones);
    });

    it("doesn't allow players to move when they reach an obstacle", async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const distanceToObstacle =
            catchFoodGame.players.get('1')!.obstacles[0].positionX - catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', distanceToObstacle);

        const tmpPlayerPositionX = catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', 50);
        expect(catchFoodGame.players.get('1')!.positionX).toBe(tmpPlayerPositionX);
    });

    it('should not backup run forward requests while at obstacle', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const distanceToObstacle =
            catchFoodGame.players.get('1')!.obstacles[0].positionX - catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', distanceToObstacle);

        const tmpPlayerPositionX = catchFoodGame.players.get('1')!.positionX;
        for (let i = 0; i < 10; i++) {
            catchFoodGame['runForward']('1', 50);
        }
        completeNextObstacle(catchFoodGame, '1');
        expect(catchFoodGame.players.get('1')!.positionX).toBe(tmpPlayerPositionX);
    });

    it('should recognise when a player has completed an obstacle', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        completeNextObstacle(catchFoodGame, '1');
        expect(catchFoodGame.players.get('1')!.atObstacle).toBeFalsy();
    });

    it('sets positionX to Obstacle when player has reached it (should not be further than obstacle position)', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const obstaclePosition = catchFoodGame.players.get('1')!.obstacles[0].positionX;
        const distanceToObstacle = obstaclePosition - catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', distanceToObstacle + 500);
        expect(catchFoodGame.players.get('1')!.positionX).toBe(obstaclePosition);
    });

    it('should remove a completed obstacle', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        completeNextObstacle(catchFoodGame, '1');
        expect(catchFoodGame.players.get('1')!.obstacles.length).toBe(catchFoodGame.numberOfObstacles + catchFoodGame.numberOfStones - 1);
    });

    it('can move a player again when obstacle is completed', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        completeNextObstacle(catchFoodGame, '1');
        const tmpPlayerPositionX = catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', 5);
        expect(catchFoodGame.players.get('1')!.positionX).toBe(tmpPlayerPositionX + 5);
    });

    it('should not have obstacles left when the player has completed them', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        completePlayersObstacles(catchFoodGame, '1');
        expect(catchFoodGame.players.get('1')!.obstacles.length).toBe(0);
    });
});

describe('Player has finished race', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('should set a player as finished when they have reached the end of the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        finishPlayer(catchFoodGame, '1');
        expect(catchFoodGame.players.get('1')!.finished).toBeTruthy();
    });

    it('should not set a player as finished if they have not completed all their obstacles but reached the goal', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame['runForward']('1', TRACKLENGTH);
        expect(catchFoodGame.players.get('1')!.finished).toBeFalsy();
    });

    it('should not set a player as finished if they have not reached the goal but completed their obstacles', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        completePlayersObstacles(catchFoodGame, '1');
        expect(catchFoodGame.players.get('1')!.finished).toBeFalsy();
    });

    it('should not be able to run forward when player has finished the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        // finish player 1
        finishPlayer(catchFoodGame, '1');
        const lengthRun = catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', 10);
        expect(catchFoodGame.players.get('1')!.positionX).toBe(lengthRun);
    });

    it('playerHasPassedGoal is called and returns false', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const playerHasPassedGoalSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasPassedGoal');
        catchFoodGame['runForward']('1', 5);
        expect(playerHasPassedGoalSpy).toHaveBeenCalled();
        expect(playerHasPassedGoalSpy).toHaveReturnedWith(false);
    });

    it('playerHasPassedGoal is called and returns true', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        // finish player 1
        const playerHasPassedGoalSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasPassedGoal');
        finishPlayer(catchFoodGame, '1');
        expect(playerHasPassedGoalSpy).toHaveBeenCalled();
        expect(playerHasPassedGoalSpy).toHaveReturnedWith(true);
    });

    it('playerHasFinishedGame is called', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const playerHasFinishedGameSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasFinishedGame');
        finishPlayer(catchFoodGame, '1');
        expect(playerHasFinishedGameSpy).toHaveBeenCalled();
    });

    it('should have a current rank of 2 after the first player has finished', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        finishPlayer(catchFoodGame, '1');
        expect(catchFoodGame['currentRank']).toBe(2);
    });
});

describe('Game finished', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('all players should be marked as finished', async () => {
        catchFoodGame = await startAndFinishGameDifferentTimes(catchFoodGame);
        expect(catchFoodGame.players.get('1')!.finished).toBeTruthy();
        expect(catchFoodGame.players.get('2')!.finished).toBeTruthy();
        expect(catchFoodGame.players.get('3')!.finished).toBeTruthy();
        expect(catchFoodGame.players.get('4')!.finished).toBeTruthy();
    });

    it('should give the second player that finishes a rank of 2', async () => {
        catchFoodGame = await startAndFinishGameDifferentTimes(catchFoodGame);
        expect(catchFoodGame.players.get('2')!.rank).toBe(2);
    });

    it('should give the third player that finishes a rank of 3', async () => {
        catchFoodGame = await startAndFinishGameDifferentTimes(catchFoodGame);
        expect(catchFoodGame.players.get('3')!.rank).toBe(3);
    });

    it('should give the fourth player that finishes a rank of 4', async () => {
        catchFoodGame = await startAndFinishGameDifferentTimes(catchFoodGame);
        expect(catchFoodGame.players.get('4')!.rank).toBe(4);
    });

    it('creates game finished event with the correct properties', async () => {
        const eventData = await getGameFinishedDataDifferentTimes(catchFoodGame);
        const expectedEventObj = {
            roomId: catchFoodGame.roomId,
            gameState: GameState.Finished,
            trackLength: catchFoodGame.trackLength,
            numberOfObstacles: catchFoodGame.numberOfObstacles,
        };

        expect(eventData).toMatchObject(expectedEventObj);
        expect(eventData).toHaveProperty('playerRanks');
    });
});
