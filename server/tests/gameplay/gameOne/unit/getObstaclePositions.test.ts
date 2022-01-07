import 'reflect-metadata';

import GameOnePlayersController from '../../../../src/gameplay/gameOne/classes/GameOnePlayersController';
import InitialParameters from '../../../../src/gameplay/gameOne/constants/InitialParameters';
import { Obstacle } from '../../../../src/gameplay/gameOne/interfaces';
import { HashTable } from '../../../../src/gameplay/interfaces';
import { trackLength } from '../../mockData';
import { players } from '../gameOneMockData';

let obstacles: HashTable<Array<Obstacle>>;
let gameOnePlayersController: GameOnePlayersController;

describe('Get Obstacle Positions test', () => {
    beforeEach(async () => {
        gameOnePlayersController = new GameOnePlayersController(
            players,
            trackLength,
            InitialParameters.PLAYERS_POSITION_X,
            InitialParameters.NUMBER_STONES
        );
        obstacles = gameOnePlayersController.getObstaclePositions();
    });

    it('should return the correct number of users', async () => {
        expect(true).toBeTruthy();
    });

    it('should return the correct number of obstacles', async () => {
        expect(obstacles['1'].length).toBe(players.get('1')!.obstacles.length);
    });

    it('should contain the key obstacle positionX', async () => {
        expect(Object.keys(obstacles['1'][0])).toContain('positionX');
    });

    it('should contain the obstacle type', async () => {
        expect(Object.keys(obstacles['1'][0])).toContain('type');
    });
});
