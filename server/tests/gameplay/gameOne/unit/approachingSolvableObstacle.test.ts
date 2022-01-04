import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import InitialParameters from '../../../../src/gameplay/gameOne/constants/InitialParameters';
import { ObstacleType } from '../../../../src/gameplay/gameOne/enums';
import {
    GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE, GameOneEventMessage
} from '../../../../src/gameplay/gameOne/interfaces/GameOneEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameOne: GameOne;
let gameEventEmitter: GameEventEmitter;

describe('Approaching solvable obstacle', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
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
        player.stonesCarrying = 1;
        player.runForward(player.obstacles[0].positionX - InitialParameters.APPROACH_SOLVABLE_OBSTACLE_DISTANCE / 2);

        // gameOne['handlePlayerApproachingSolvableObstacle'](player);
        expect(eventCalled).toBeFalsy();
    });

    // it('should emit approachingSolvableObstacle event type stone on approaching stone if player is not already carrying one', async () => {
    //     let eventCalled = false;
    //     gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
    //         if (message.type === GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE) {
    //             eventCalled = true;
    //         }
    //     });
    //     const player = gameOne.players.get(users[0].id)!;
    //     player.obstacles[0].type = ObstacleType.Stone;
    //     gameOne['handlePlayerApproachingSolvableObstacle'](player);
    //     expect(eventCalled).toBeTruthy();
    // });

    // it('should emit approachingSolvableObstacle event type stone on approaching obstacle that is not a stone, even if carrying stone', async () => {
    //     let eventCalled = false;
    //     gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
    //         if (message.type === GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE) {
    //             eventCalled = true;
    //         }
    //     });
    //     const player = gameOne.players.get(users[0].id)!;
    //     player.obstacles[0].type = ObstacleType.Trash;
    //     player.stonesCarrying = 1;
    //     gameOne['handlePlayerApproachingSolvableObstacle'](player);
    //     expect(eventCalled).toBeTruthy();
    // });
});
