import 'reflect-metadata';

import { GameState } from '../../../../src/gameplay/enums';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;

describe('Handle Input Method', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.gameState = GameState.Started;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.todo('Start Game tests');
});
