import 'reflect-metadata';

import { GameNames } from '../../../../src/enums/gameNames';
import { GameThree } from '../../../../src/gameplay';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;

describe('Initiate Game', () => {
    beforeEach(async () => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    it('initiates gameStartedTime with 0', async () => {
        expect(gameThree['_gameStartedAt']).toBe(0);
    });

    it('initiates gameName with Game3', async () => {
        expect(gameThree['gameName']).toBe(GameNames.GAME3);
    });

    it('initiates roomId with correct value', async () => {
        expect(gameThree['roomId']).toBe(roomId);
    });

    it('initiates sendGameStateUpdates with false', async () => {
        expect(gameThree['sendGameStateUpdates']).toBeFalsy();
    });
});
