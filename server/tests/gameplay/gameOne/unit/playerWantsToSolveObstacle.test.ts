import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { Obstacle } from '../../../../src/gameplay/gameOne/interfaces';
import {
    GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED, GameOneEventMessage
} from '../../../../src/gameplay/gameOne/interfaces/GameOneEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameOne: GameOne;
let gameEventEmitter: GameEventEmitter;
let firstObstacleId: number;
let firstObstacle: Obstacle;

describe('Player wants to Solve Obstacle', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.gameState = GameState.Started;
        firstObstacleId = gameOne.players.get(users[0].id)!.obstacles[0].id;
        firstObstacle = gameOne.players.get(users[0].id)!.obstacles[0];
    });

    it("should set the obstacle's solvable property to false", async () => {
        firstObstacle.solvable = true;
        gameOne['playerWantsToSolveObstacle'](users[0].id, firstObstacleId);
        expect(firstObstacle.solvable).toBeFalsy();
    });

    it('should not emit playerWantsToSolveObstacle event', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED) {
                eventCalled = true;
            }
        });
        gameOne['playerWantsToSolveObstacle'](users[0].id, firstObstacleId);
        expect(eventCalled).toBeTruthy();
    });
});
