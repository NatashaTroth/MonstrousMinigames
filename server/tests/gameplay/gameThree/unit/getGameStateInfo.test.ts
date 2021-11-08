import 'reflect-metadata';

import { GameState } from '../../../../src/gameplay/enums';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { GameStateInfo } from '../../../../src/gameplay/gameThree/interfaces';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;

let gameStateInfo: GameStateInfo;

describe('Get game state info ', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameStateInfo = gameThree.getGameStateInfo();
    });

    it('should return Initialised gameState', async () => {
        expect(gameStateInfo.gameState).toBe(GameState.Initialised);
    });

    it('should return roomId', async () => {
        expect(gameStateInfo.roomId).toBe(roomId);
    });
});
