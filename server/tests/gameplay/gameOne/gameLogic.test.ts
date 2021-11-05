import 'reflect-metadata';

import { GameOne } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/enums';
import { ObstacleType } from '../../../src/gameplay/gameOne/enums';
import { leaderboard, roomId } from '../mockData';
import {
    clearTimersAndIntervals, completeNextObstacle, completePlayersObstacles, finishPlayer,
    getGameFinishedDataDifferentTimes, goToNextUnsolvableObstacle, startAndFinishGameDifferentTimes,
    startGameAndAdvanceCountdown
} from './gameHelperFunctions';

const TRACK_LENGTH = 5000; // has to be bigger than initial player position

let gameOne: GameOne;
const dateNow = 1618665766156;

describe('Start game', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('starts players at initial positionX', async () => {
        startGameAndAdvanceCountdown(gameOne);
        expect(gameOne.players.get('1')?.positionX).toBe(gameOne.initialPlayerPositionX);
    });

    it('gameStartedTime is now', async () => {
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(gameOne);
        // const afterCountdownTime = Date.now();
        // advanceCountdown(50);
        //Remove last 2 digits (could be slight difference)
        expect(gameOne['_gameStartedAt']).toBe(Date.now());
    });
});

describe('Run forward', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(gameOne);
    });

    it('moves players forward when runForward is called', async () => {
        const SPEED = 10;
        startGameAndAdvanceCountdown(gameOne);
        gameOne['runForward']('1', SPEED);
        expect(gameOne.players.get('1')?.positionX).toBe(gameOne.initialPlayerPositionX + SPEED);
    });

    it('moves players forward correctly when runForward is called multiple times', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne['runForward']('1', 10);
        gameOne['runForward']('1', 5);
        expect(gameOne.players.get('1')?.positionX).toBe(gameOne.initialPlayerPositionX + 15);
    });
});

const removeStonesFromObstacles = (game: GameOne) => () => {
    game.players.get('1')!.obstacles = game.players
        .get('1')!
        .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
};

describe('Obstacles reached', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(gameOne);
    });

    it('playerHasReachedObstacle is called and returns false', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const playerHasReachedObstacleSpy = jest.spyOn(GameOne.prototype as any, 'playerHasReachedObstacle');
        gameOne['runForward']('1', gameOne.players.get('1')!.obstacles[0].positionX / 2);
        expect(playerHasReachedObstacleSpy).toHaveBeenCalled();
        expect(playerHasReachedObstacleSpy).toHaveReturnedWith(false);
    });

    it('recognises when player has reached an obstacle', async () => {
        startGameAndAdvanceCountdown(gameOne);
        goToNextUnsolvableObstacle(gameOne, '1');
        expect(gameOne.players.get('1')!.atObstacle).toBeTruthy();
    });

    it('playerHasReachedObstacle is called and returns true', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const distanceToObstacle =
            gameOne.players.get('1')!.obstacles[0].positionX - gameOne.players.get('1')!.positionX;
        const playerHasReachedObstacleSpy = jest.spyOn(GameOne.prototype as any, 'playerHasReachedObstacle');
        gameOne['runForward']('1', distanceToObstacle);
        expect(playerHasReachedObstacleSpy).toHaveBeenCalled();
        expect(playerHasReachedObstacleSpy).toHaveReturnedWith(true);
    });

    it('handlePlayerReachedObstacle is called', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const distanceToObstacle =
            gameOne.players.get('1')!.obstacles[0].positionX - gameOne.players.get('1')!.positionX;
        const handlePlayerReachedObstacleSpy = jest.spyOn(GameOne.prototype as any, 'handlePlayerReachedObstacle');
        gameOne['runForward']('1', distanceToObstacle);
        expect(handlePlayerReachedObstacleSpy).toHaveBeenCalled();
    });

    it("doesn't remove an obstacle when a player arrives at it", async () => {
        startGameAndAdvanceCountdown(gameOne, removeStonesFromObstacles(gameOne));
        const distanceToObstacle =
            gameOne.players.get('1')!.obstacles[0].positionX - gameOne.players.get('1')!.positionX;
        gameOne['runForward']('1', distanceToObstacle);
        expect(gameOne.players.get('1')!.obstacles.length).toBe(gameOne.numberOfObstacles);
    });

    it('removes a stone obstacle when a player arrives at it carrying one', async () => {
        startGameAndAdvanceCountdown(gameOne, () => {
            gameOne.players.get('1')!.obstacles = gameOne.players
                .get('1')!
                .obstacles.filter(obstacle => obstacle.type === ObstacleType.Stone);
            gameOne.players.get('1')!.stonesCarrying = 1;
        });
        const distanceToObstacle =
            gameOne.players.get('1')!.obstacles[0].positionX - gameOne.players.get('1')!.positionX;
        gameOne['runForward']('1', distanceToObstacle);
        expect(gameOne.players.get('1')!.obstacles.length).toBe(gameOne.numberOfStones - 1);
    });

    it("doesn't allow players to move when they reach an obstacle", async () => {
        startGameAndAdvanceCountdown(gameOne, removeStonesFromObstacles(gameOne));
        const distanceToObstacle =
            gameOne.players.get('1')!.obstacles[0].positionX - gameOne.players.get('1')!.positionX;
        gameOne['runForward']('1', distanceToObstacle);

        const tmpPlayerPositionX = gameOne.players.get('1')!.positionX;
        gameOne['runForward']('1', 50);
        expect(gameOne.players.get('1')!.positionX).toBe(tmpPlayerPositionX);
    });

    it('should not backup run forward requests while at obstacle', async () => {
        startGameAndAdvanceCountdown(gameOne);
        goToNextUnsolvableObstacle(gameOne, '1');

        const tmpPlayerPositionX = gameOne.players.get('1')!.positionX;
        for (let i = 0; i < 10; i++) {
            gameOne['runForward']('1', 50);
        }
        completeNextObstacle(gameOne, '1');
        expect(gameOne.players.get('1')!.positionX).toBe(tmpPlayerPositionX);
    });

    it('should recognise when a player has completed an obstacle', async () => {
        startGameAndAdvanceCountdown(gameOne);
        completeNextObstacle(gameOne, '1');
        expect(gameOne.players.get('1')!.atObstacle).toBeFalsy();
    });

    it('sets positionX to Obstacle when player has reached it (should not be further than obstacle position)', async () => {
        startGameAndAdvanceCountdown(gameOne);
        goToNextUnsolvableObstacle(gameOne, '1');
        const obstaclePosition = gameOne.players.get('1')!.obstacles[0].positionX;
        gameOne['runForward']('1', 500);
        expect(gameOne.players.get('1')!.positionX).toBe(obstaclePosition);
    });

    it('should remove a completed obstacle', async () => {
        startGameAndAdvanceCountdown(gameOne);
        completeNextObstacle(gameOne, '1');
        expect(gameOne.players.get('1')!.obstacles.length).toBe(gameOne.numberOfObstacles + gameOne.numberOfStones - 1);
    });

    it('can move a player again when obstacle is completed', async () => {
        startGameAndAdvanceCountdown(gameOne, removeStonesFromObstacles(gameOne));
        completeNextObstacle(gameOne, '1');
        const tmpPlayerPositionX = gameOne.players.get('1')!.positionX;
        gameOne['runForward']('1', 5);
        expect(gameOne.players.get('1')!.positionX).toBe(tmpPlayerPositionX + 5);
    });

    it('should not have obstacles left when the player has completed them', async () => {
        startGameAndAdvanceCountdown(gameOne);
        completePlayersObstacles(gameOne, '1');
        expect(gameOne.players.get('1')!.obstacles.length).toBe(0);
    });
});

describe('Player has finished race', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(gameOne);
    });

    it('should set a player as finished when they have reached the end of the race', async () => {
        startGameAndAdvanceCountdown(gameOne);
        finishPlayer(gameOne, '1');
        expect(gameOne.players.get('1')!.finished).toBeTruthy();
    });

    it('should not set a player as finished if they have not completed all their obstacles but reached the goal', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne['runForward']('1', TRACK_LENGTH);
        expect(gameOne.players.get('1')!.finished).toBeFalsy();
    });

    it('should not set a player as finished if they have not reached the goal but completed their obstacles', async () => {
        startGameAndAdvanceCountdown(gameOne);
        completePlayersObstacles(gameOne, '1');
        expect(gameOne.players.get('1')!.finished).toBeFalsy();
    });

    it('should not be able to run forward when player has finished the race', async () => {
        startGameAndAdvanceCountdown(gameOne);
        // finish player 1
        finishPlayer(gameOne, '1');
        const lengthRun = gameOne.players.get('1')!.positionX;
        gameOne['runForward']('1', 10);
        expect(gameOne.players.get('1')!.positionX).toBe(lengthRun);
    });

    it('playerHasPassedGoal is called and returns false', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const playerHasPassedGoalSpy = jest.spyOn(GameOne.prototype as any, 'playerHasPassedGoal');
        gameOne['runForward']('1', 5);
        expect(playerHasPassedGoalSpy).toHaveBeenCalled();
        expect(playerHasPassedGoalSpy).toHaveReturnedWith(false);
    });

    it('playerHasPassedGoal is called and returns true', async () => {
        startGameAndAdvanceCountdown(gameOne);
        // finish player 1
        const playerHasPassedGoalSpy = jest.spyOn(GameOne.prototype as any, 'playerHasPassedGoal');
        finishPlayer(gameOne, '1');
        expect(playerHasPassedGoalSpy).toHaveBeenCalled();
        expect(playerHasPassedGoalSpy).toHaveReturnedWith(true);
    });

    it('playerHasFinishedGame is called', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const playerHasFinishedGameSpy = jest.spyOn(GameOne.prototype as any, 'playerHasFinishedGame');
        finishPlayer(gameOne, '1');
        expect(playerHasFinishedGameSpy).toHaveBeenCalled();
    });

    it('should have a current rank of 2 after the first player has finished', async () => {
        startGameAndAdvanceCountdown(gameOne);
        finishPlayer(gameOne, '1');
        expect(gameOne['currentRank']).toBe(2);
    });
});

describe('Game finished', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(gameOne);
    });

    it('all players should be marked as finished', async () => {
        gameOne = await startAndFinishGameDifferentTimes(gameOne);
        expect(gameOne.players.get('1')!.finished).toBeTruthy();
        expect(gameOne.players.get('2')!.finished).toBeTruthy();
        expect(gameOne.players.get('3')!.finished).toBeTruthy();
        expect(gameOne.players.get('4')!.finished).toBeTruthy();
    });

    it('should give the second player that finishes a rank of 2', async () => {
        gameOne = await startAndFinishGameDifferentTimes(gameOne);
        expect(gameOne.players.get('2')!.rank).toBe(2);
    });

    it('should give the third player that finishes a rank of 3', async () => {
        gameOne = await startAndFinishGameDifferentTimes(gameOne);
        expect(gameOne.players.get('3')!.rank).toBe(3);
    });

    it('should give the fourth player that finishes a rank of 4', async () => {
        gameOne = await startAndFinishGameDifferentTimes(gameOne);
        expect(gameOne.players.get('4')!.rank).toBe(4);
    });

    it('creates game finished event with the correct properties', async () => {
        const eventData = await getGameFinishedDataDifferentTimes(gameOne);
        const expectedEventObj = {
            roomId: gameOne.roomId,
            gameState: GameState.Finished,
        };

        expect(eventData).toMatchObject(expectedEventObj);
        expect(eventData).toHaveProperty('playerRanks');
    });
});
