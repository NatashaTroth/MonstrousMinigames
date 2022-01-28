import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import { ObstacleType } from '../../../../src/gameplay/gameOne/enums';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import {
    GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE, GameOneEventMessage
} from '../../../../src/gameplay/gameOne/interfaces/GameOneEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameOne: GameOne;
let gameEventEmitter: GameEventEmitter;
const InitialParameters = getInitialParams();

describe('Approaching solvable obstacle', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    afterEach(() => {
        DI.clearInstances();
    });

    afterAll(() => {
        gameEventEmitter.removeAllListeners();
    });

    it('should emit approachingSolvableObstacle event on approaching stone if player is not already carrying a stone', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE) {
                eventCalled = true;
            }
        });
        const player = gameOne.players.get(users[0].id)!;
        player.obstacles[0].type = ObstacleType.Stone;
        player.obstacles[0].solvable = true;
        player.stonesCarrying = 0;

        player.runForward(
            player.obstacles[0].positionX - InitialParameters.APPROACH_SOLVABLE_OBSTACLE_DISTANCE - player.positionX
        );

        // gameOne['handlePlayerApproachingSolvableObstacle'](player);
        expect(eventCalled).toBeTruthy();
    });

    it('should not emit approachingSolvableObstacle event on approaching stone if player is already carrying a stone', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE) {
                eventCalled = true;
            }
        });
        const player = gameOne.players.get(users[0].id)!;
        player.obstacles[0].type = ObstacleType.Stone;
        player.obstacles[0].solvable = true;
        player.stonesCarrying = 1;
        player.runForward(
            player.obstacles[0].positionX - InitialParameters.APPROACH_SOLVABLE_OBSTACLE_DISTANCE / 2 - player.positionX
        );

        // gameOne['handlePlayerApproachingSolvableObstacle'](player);
        expect(eventCalled).toBeFalsy();
    });

    it.todo('fix, flakey');
    xit('should emit approachingSolvableObstacle event type stone on approaching obstacle that is not a stone, even if carrying stone', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE) {
                eventCalled = true;
            }
        });
        const player = gameOne.players.get(users[0].id)!;
        player.obstacles[0].type = ObstacleType.Trash;
        player.stonesCarrying = 1;
        player.runForward(
            player.obstacles[0].positionX - InitialParameters.APPROACH_SOLVABLE_OBSTACLE_DISTANCE / 2 - player.positionX
        );
        expect(eventCalled).toBeTruthy();
    });
});
