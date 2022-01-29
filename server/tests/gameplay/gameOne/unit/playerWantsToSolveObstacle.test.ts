import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import GameOnePlayer from '../../../../src/gameplay/gameOne/GameOnePlayer';
import { Obstacle } from '../../../../src/gameplay/gameOne/interfaces';
import {
    GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED, GameOneEventMessage
} from '../../../../src/gameplay/gameOne/interfaces/GameOneEventMessages';
import { users } from '../../mockData';
import { players } from '../gameOneMockData';

let gameEventEmitter: GameEventEmitter;
let firstObstacleId: number;
let firstObstacle: Obstacle;
let gameOnePlayer: GameOnePlayer;

describe('Player wants to Solve Obstacle', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(async () => {
        gameOnePlayer = players.get(users[0].id)!;
        firstObstacle = gameOnePlayer.obstacles[0];
        firstObstacleId = gameOnePlayer.obstacles[0].id;
    });

    afterAll(() => {
        gameEventEmitter.removeAllListeners();
    });

    afterEach(() => {
        DI.clearInstances();
    });

    it("should set the obstacle's solvable property to false", async () => {
        firstObstacle.solvable = true;
        gameOnePlayer.playerWantsToSolveObstacle(firstObstacleId);
        expect(firstObstacle.solvable).toBeFalsy();
    });

    it('should not emit playerWantsToSolveObstacle event', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED) {
                eventCalled = true;
            }
        });
        gameOnePlayer.playerWantsToSolveObstacle(firstObstacleId);
        expect(eventCalled).toBeTruthy();
    });
});
