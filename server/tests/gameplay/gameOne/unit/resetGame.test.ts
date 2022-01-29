import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../../mockData';

const NEW_TRACKLENGTH = 1000;
const NEW_NUMBER_OF_OBSTACLES = 6;
const NEW_STONE_COUNT = 1;
let gameOne: GameOne;

describe('Create new game tests', () => {
    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
        gameOne.createNewGame(users);
        gameOne.gameState = GameState.Finished;
        gameOne.createNewGame(users, NEW_TRACKLENGTH, NEW_NUMBER_OF_OBSTACLES, NEW_STONE_COUNT);
    });

    it('should have the correct new number of players', async () => {
        expect(gameOne.players.size).toBe(users.length);
    });

    it('should have the correct tracklength', async () => {
        expect(gameOne.trackLength).toBe(NEW_TRACKLENGTH);
    });

    it('should have the correct name for player 1', async () => {
        expect(gameOne.players.get('1')!.name).toBe(users[0].name);
    });

    it('should have a player not at an obstacle', async () => {
        expect(gameOne.players.get('1')!.atObstacle).toBeFalsy();
    });

    it('should set the player to not be finished', async () => {
        expect(gameOne.players.get('1')!.finished).toBeFalsy();
    });

    it('should have initiated the correct new number of obstacles', async () => {
        expect(gameOne.players.get('1')!.obstacles.length).toBe(NEW_NUMBER_OF_OBSTACLES + NEW_STONE_COUNT);
    });
});
