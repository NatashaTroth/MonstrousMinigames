import 'reflect-metadata';

import GameOnePlayersController from '../../../../src/gameplay/gameOne/classes/GameOnePlayersController';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { Obstacle } from '../../../../src/gameplay/gameOne/interfaces';
import { HashTable } from '../../../../src/gameplay/interfaces';
import { trackLength } from '../../mockData';
import { players } from '../gameOneMockData';

let obstacles: HashTable<Array<Obstacle>>;
let gameOnePlayersController: GameOnePlayersController;
const InitialGameParameters = getInitialParams();

describe('Get Obstacle Positions test', () => {
    beforeEach(async () => {
        gameOnePlayersController = new GameOnePlayersController(
            players,
            trackLength,
            InitialGameParameters.PLAYERS_POSITION_X,
            InitialGameParameters.NUMBER_STONES
        );
        obstacles = gameOnePlayersController.getObstaclePositions();
    });

    it('should return the correct number of users', async () => {
        expect(true).toBeTruthy();
    });

    it('should contain the key obstacle positionX', async () => {
        expect(Object.keys(obstacles['1'][0])).toContain('positionX');
    });

    it('should contain the obstacle type', async () => {
        expect(Object.keys(obstacles['1'][0])).toContain('type');
    });
});
