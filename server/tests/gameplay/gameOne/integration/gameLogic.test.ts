import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { Difficulty, GameState } from '../../../../src/gameplay/enums';
import { ObstacleType } from '../../../../src/gameplay/gameOne/enums';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { leaderboard, roomId } from '../../mockData';
import {
    clearTimersAndIntervals, completeObstacles, finishPlayer, getGameFinishedDataDifferentTimes,
    goToNextUnsolvableObstacle, startAndFinishGameDifferentTimes, startGameAndAdvanceCountdown
} from '../gameOneHelperFunctions';
import { playerHasCompletedObstacleMessage, runForwardMessage } from '../gameOneMockData';

const TRACK_LENGTH = 5000; // has to be bigger than initial player position

let gameOne: GameOne;
const dateNow = 1618665766156;
const InitialParameters = getInitialParams();

describe('Start game', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
        jest.clearAllMocks();
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
        jest.clearAllMocks();
    });

    it('moves players forward when runForward is called', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.receiveInput({ ...runForwardMessage, userId: '1' });
        expect(gameOne.players.get('1')?.positionX).toBe(gameOne.initialPlayerPositionX + InitialParameters.SPEED);
    });

    it('moves players forward correctly when runForward is called multiple times', async () => {
        const userId = '1';
        startGameAndAdvanceCountdown(gameOne);
        gameOne.receiveInput({ ...runForwardMessage, userId });

        gameOne.players.get('1')!.countRunsPerFrame = 0; // to avoid going over limit for this test
        gameOne.receiveInput({ ...runForwardMessage, userId });

        expect(gameOne.players.get('1')?.positionX).toBe(gameOne.initialPlayerPositionX + InitialParameters.SPEED * 2);
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
        jest.clearAllMocks();
    });

    it('recognises when player has reached an obstacle', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const player = gameOne.players.get('1')!;
        goToNextUnsolvableObstacle(gameOne, player);
        expect(player.atObstacle).toBeTruthy();
    });

    it.todo('flakey:');
    it.skip('removes a stone obstacle when a player arrives at it carrying one', async () => {
        startGameAndAdvanceCountdown(gameOne, () => {
            gameOne.players.get('1')!.obstacles = gameOne.players
                .get('1')!
                .obstacles.filter(obstacle => obstacle.type === ObstacleType.Stone);
            gameOne.players.get('1')!.stonesCarrying = 1;
        });

        //todo run forward till get to obstacle

        gameOne.receiveInput({ ...runForwardMessage, userId: '1' });
        expect(gameOne.players.get('1')!.obstacles.length).toBe(gameOne.numberOfStones - 1);
    });

    it("doesn't allow players to move when they reach an obstacle", async () => {
        startGameAndAdvanceCountdown(gameOne, removeStonesFromObstacles(gameOne));
        const player = gameOne.players.get('1')!;
        goToNextUnsolvableObstacle(gameOne, player);
        gameOne.receiveInput({ ...runForwardMessage, userId: '1' });

        const tmpPlayerPositionX = player.positionX;
        gameOne.receiveInput({ ...runForwardMessage, userId: '1' });

        expect(player.positionX).toBe(tmpPlayerPositionX);
    });

    it('should not backup run forward requests while at obstacle', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const player = gameOne.players.get('1')!;

        goToNextUnsolvableObstacle(gameOne, player);

        const tmpPlayerPositionX = player.positionX;
        for (let i = 0; i < 10; i++) {
            gameOne.receiveInput({ ...runForwardMessage, userId: '1' });
        }
        gameOne.receiveInput({ ...playerHasCompletedObstacleMessage, userId: '1' });
        expect(player.positionX).toBe(tmpPlayerPositionX);
    });

    it('should recognise when a player has completed an obstacle', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.receiveInput({ ...playerHasCompletedObstacleMessage, userId: '1' });
        expect(gameOne.players.get('1')!.atObstacle).toBeFalsy();
    });

    it('sets positionX to Obstacle when player has reached it (should not be further than obstacle position)', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const player = gameOne.players.get('1')!;
        goToNextUnsolvableObstacle(gameOne, player);
        const obstaclePosition = player.obstacles[0].positionX;
        for (let i = 0; i < gameOne.trackLength; i++) {
            gameOne.receiveInput({ ...runForwardMessage, userId: '1' });
        }
        expect(player.positionX).toBe(obstaclePosition);
    });

    it.todo('Flakey:');
    it.skip('should remove a completed obstacle', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.receiveInput({ ...playerHasCompletedObstacleMessage, userId: '1' });
        expect(gameOne.players.get('1')!.obstacles.length).toBe(gameOne.numberOfObstacles + gameOne.numberOfStones - 1);
    });

    it('can move a player again when obstacle is completed', async () => {
        startGameAndAdvanceCountdown(gameOne, removeStonesFromObstacles(gameOne));
        const player = gameOne.players.get('1')!;
        gameOne.receiveInput({ ...playerHasCompletedObstacleMessage, userId: '1' });
        const tmpPlayerPositionX = player.positionX;
        player.countRunsPerFrame = 0; // to avoid going over limit for this test
        gameOne.receiveInput({ ...runForwardMessage, userId: '1' });

        expect(player.positionX).toBe(tmpPlayerPositionX + InitialParameters.SPEED);
    });

    it('should not have obstacles left when the player has completed them', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const player = gameOne.players.get('1')!;
        completeObstacles(gameOne, player);
        expect(player.obstacles.length).toBe(0);
    });
});

describe('Player has finished race', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(gameOne);
        jest.clearAllMocks();
    });

    it('should set a player as finished when they have reached the end of the race', async () => {
        startGameAndAdvanceCountdown(gameOne);
        finishPlayer(gameOne, '1');
        expect(gameOne.players.get('1')!.finished).toBeTruthy();
    });

    it('should not set a player as finished if they have not completed all their obstacles but reached the goal', async () => {
        startGameAndAdvanceCountdown(gameOne);
        for (let i = 0; i < gameOne.trackLength; i++) {
            gameOne.receiveInput({ ...runForwardMessage, userId: '1' });
        }
        expect(gameOne.players.get('1')!.finished).toBeFalsy();
    });

    it.todo('Flakey:');
    xit('should not set a player as finished if they have not reached the goal but completed their obstacles', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const player = gameOne.players.get('1')!;
        completeObstacles(gameOne, player);
        expect(player.finished).toBeFalsy();
    });

    it('should not be able to run forward when player has finished the race', async () => {
        startGameAndAdvanceCountdown(gameOne);
        // finish player 1
        finishPlayer(gameOne, '1');
        const lengthRun = gameOne.players.get('1')!.positionX;
        gameOne.receiveInput({ ...runForwardMessage, userId: '1' });
        expect(gameOne.players.get('1')!.positionX).toBe(lengthRun);
    });

    it('should not set player to finished when the goal has not been passed', async () => {
        startGameAndAdvanceCountdown(gameOne);

        gameOne.receiveInput({ ...runForwardMessage, userId: '1' });
        expect(gameOne.players.get('1')!.finished).toBeFalsy();
    });

    it('should  set player to finished when the goal has  been passed', async () => {
        startGameAndAdvanceCountdown(gameOne);
        // finish player 1
        finishPlayer(gameOne, '1');
        expect(gameOne.players.get('1')!.finished).toBeTruthy();
    });
});

describe('Game finished', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard, Difficulty.MEDIUM, false);
        jest.useFakeTimers();
    });
    afterEach(() => {
        clearTimersAndIntervals(gameOne);
        jest.clearAllMocks();
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
        console.log(Array.from(gameOne.players.values()).map(p => p.rank));
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
