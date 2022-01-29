import 'reflect-metadata';

import UserHasNoStones from '../../../../src/gameplay/gameOne/customErrors/UserHasNoStones';
import GameOnePlayer from '../../../../src/gameplay/gameOne/GameOnePlayer';
import { Obstacle } from '../../../../src/gameplay/gameOne/interfaces';
import { users } from '../../mockData';
import { players } from '../gameOneMockData';

let firstObstacle: Obstacle;
let gameOnePlayer: GameOnePlayer;

describe('Completed stone obstacle', () => {
    beforeEach(async () => {
        gameOnePlayer = players.get(users[0].id)!;
    });

    it("should increase the player's stonesCarrying property by one", async () => {
        firstObstacle = gameOnePlayer.obstacles[0];
        gameOnePlayer.atObstacle = true;
        const initialStonesCarrying = gameOnePlayer.stonesCarrying;
        gameOnePlayer.obstacleCompleted(firstObstacle.id);
        expect(gameOnePlayer.stonesCarrying).toBe(initialStonesCarrying + 1);
    });

    it('should throw a UserHasNoStones error if a user has no stone', async () => {
        gameOnePlayer.stonesCarrying = 0;
        expect(() => gameOnePlayer.throwStone()).toThrowError(UserHasNoStones);
    });
});
