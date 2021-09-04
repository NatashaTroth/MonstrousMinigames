import { CatchFoodGame } from '../../../src/gameplay';
import { leaderboard, roomId, users } from '../mockData';
import { clearTimersAndIntervals, releaseThreadN, startAndFinishGame } from './gameHelperFunctions';

const NEW_TRACKLENGTH = 1000;
const NEW_NUMBER_OF_OBSTACLES = 6;
const NEW_STONE_COUNT = 1;
let catchFoodGame: CatchFoodGame;

describe('Create new game tests', () => {
    beforeEach(async () => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
        // console.log(catchFoodGame.players.get('1'));

        startAndFinishGame(catchFoodGame);
        await releaseThreadN(3);
        catchFoodGame.createNewGame(users, NEW_TRACKLENGTH, NEW_NUMBER_OF_OBSTACLES, undefined, NEW_STONE_COUNT);
    });
    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('should have the correct new number of players', async () => {
        expect(catchFoodGame.players.size).toBe(users.length);
    });

    it('should have the correct tracklength', async () => {
        expect(catchFoodGame.trackLength).toBe(NEW_TRACKLENGTH);
    });

    it('should have the correct current rank', async () => {
        expect(catchFoodGame['currentRank']).toBe(1);
    });

    it('should have the correct name for player 1', async () => {
        expect(catchFoodGame.players.get('1')!.name).toBe(users[0].name);
    });

    it('should have a player not at an obstacle', async () => {
        expect(catchFoodGame.players.get('1')!.atObstacle).toBeFalsy();
    });

    it('should set the player to not be finished', async () => {
        expect(catchFoodGame.players.get('1')!.finished).toBeFalsy();
    });

    it('should have initiated the correct new number of obstacles', async () => {
        expect(catchFoodGame.players.get('1')!.obstacles.length).toBe(NEW_NUMBER_OF_OBSTACLES + NEW_STONE_COUNT);
    });
});
