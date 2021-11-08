import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import UserHasNoStones from '../../../../src/gameplay/gameOne/customErrors/UserHasNoStones';
import { ObstacleType } from '../../../../src/gameplay/gameOne/enums';
import { Obstacle } from '../../../../src/gameplay/gameOne/interfaces';
import { leaderboard, roomId, users } from '../../mockData';

let gameOne: GameOne;

let firstObstacle: Obstacle;

describe('Completed stone obstacle', () => {
    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.gameState = GameState.Started;
        gameOne.players.get(users[0].id)!.atObstacle = true;
        firstObstacle = gameOne.players.get(users[0].id)!.obstacles[0];
        firstObstacle.type = ObstacleType.Stone;
    });

    it("should increase the player's stonesCarrying property by one", async () => {
        const initialStonesCarrying = gameOne.players.get(users[0].id)!.stonesCarrying;
        gameOne['playerHasCompletedObstacle'](users[0].id, firstObstacle.id);
        expect(gameOne.players.get(users[0].id)!.stonesCarrying).toBe(initialStonesCarrying + 1);
    });
});

describe('Verify user can throw collected stone', () => {
    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.gameState = GameState.Started;
        gameOne.players.get(users[0].id)!.atObstacle = true;
        firstObstacle = gameOne.players.get(users[0].id)!.obstacles[0];
        firstObstacle.type = ObstacleType.Stone;
    });

    it('should throw a UserHasNoStones error if a user has no stone', async () => {
        gameOne.players.get(users[0].id)!.stonesCarrying = 0;
        expect(() => gameOne['verifyUserCanThrowCollectedStone'](users[0].id)).toThrowError(UserHasNoStones);
    });
});
