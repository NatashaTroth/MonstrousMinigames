import { CatchFoodGame } from '../../../src/gameplay';
import { GameStateInfo } from '../../../src/gameplay/catchFood/interfaces';
import { GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../mockData';
import { clearTimersAndIntervals } from './gameHelperFunctions';

const TRACKLENGTH = 500;
const NUMBER_OF_OBSTACLES = 4;
let catchFoodGame: CatchFoodGame;
let gameStateInfo: GameStateInfo;

describe('Get Obstacle Positions test', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        catchFoodGame.createNewGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES);
        gameStateInfo = catchFoodGame.getGameStateInfo();
    });

    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('should return the game state', async () => {
        expect(gameStateInfo.gameState).toBe(GameState.Created);
    });

    it('should return the roomId', async () => {
        expect(gameStateInfo.roomId).toBe(users[0].roomId);
    });

    //TODO test initial game state info
    // it('should return the track length', async () => {
    //     expect(gameStateInfo.trackLength).toBe(TRACKLENGTH);
    // });

    // it('should return the number of obstacles', async () => {
    //     expect(gameStateInfo.numberOfObstacles).toBe(NUMBER_OF_OBSTACLES);
    // });

    it('should return the playersState as an Array', async () => {
        expect(Array.isArray(gameStateInfo.playersState)).toBe(true);
    });

    it('returns first player with the correct name', async () => {
        expect(gameStateInfo.playersState[0].name).toBe(users[0].name);
    });

    it('returns player positionX with initial position', async () => {
        expect(gameStateInfo.playersState[0].positionX).toBe(catchFoodGame.initialPlayerPositionX);
    });

    it('returns player not at an obstacle', async () => {
        expect(gameStateInfo.playersState[0].atObstacle).toBeFalsy();
    });

    it('returns player as not finished', async () => {
        expect(gameStateInfo.playersState[0].finished).toBeFalsy();
    });

    it('returns player as not finished', async () => {
        expect(gameStateInfo.playersState[0].dead).toBeFalsy();
    });

    it('returns player is active', async () => {
        expect(gameStateInfo.playersState[0].isActive).toBeTruthy();
    });

    it('returns player with correct number of obstacles (all)', async () => {
        expect(gameStateInfo.playersState[0].obstacles.length).toBe(NUMBER_OF_OBSTACLES);
    });

    it('returns chaser position', async () => {
        expect(gameStateInfo.chasersPositionX).toBe(catchFoodGame.chasersPositionX);
    });
});
