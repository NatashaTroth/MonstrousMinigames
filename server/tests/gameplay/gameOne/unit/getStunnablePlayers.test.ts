import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import GameOnePlayersController from '../../../../src/gameplay/gameOne/classes/GameOnePlayersController';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { players } from '../../gameOne/gameOneMockData';
import { leaderboard, roomId, trackLength, users } from '../../mockData';

// let gameOne: GameOne;
let gameOnePlayersController: GameOnePlayersController;
const InitialParameters = getInitialParams();

describe('Stun player tests', () => {
    beforeEach(() => {
        // gameOne = new GameOne(roomId, leaderboard);
        // gameOne.createNewGame(users);
        gameOnePlayersController = new GameOnePlayersController(
            players,
            trackLength,
            InitialParameters.PLAYERS_POSITION_X,
            InitialParameters.NUMBER_STONES
        );
    });

    it('returns all players because they can all be stunned', async () => {
        expect(gameOnePlayersController.getStunnablePlayers()).toEqual(
            expect.arrayContaining(users.map(user => user.id))
        );
    });

    it('only returns players that have not finished', async () => {
        players.get(users[0].id)!.finished = true;
        expect(gameOnePlayersController.getStunnablePlayers()).toEqual(
            expect.arrayContaining(users.map(user => user.id).filter(id => id !== users[0].id))
        );
    });

    it('only returns players that are active', async () => {
        players.get(users[0].id)!.isActive = false;
        expect(gameOnePlayersController.getStunnablePlayers()).toEqual(
            expect.arrayContaining(users.map(user => user.id).filter(id => id !== users[0].id))
        );
    });

    it('only returns players that are active and not finished', async () => {
        players.get(users[0].id)!.isActive = false;
        players.get(users[0].id)!.finished = true;
        expect(gameOnePlayersController.getStunnablePlayers()).toEqual(
            expect.arrayContaining(users.map(user => user.id).filter(id => id !== users[0].id))
        );
    });
});
