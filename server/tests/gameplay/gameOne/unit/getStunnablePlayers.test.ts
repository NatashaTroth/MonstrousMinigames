import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { leaderboard, roomId, users } from '../../mockData';

let gameOne: GameOne;

describe('Stun player tests', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    it('returns all players because they can all be stunned', async () => {
        expect(gameOne['getStunnablePlayers']()).toEqual(expect.arrayContaining(users.map(user => user.id)));
    });

    it('only returns players that have not finished', async () => {
        gameOne.players.get(users[0].id)!.finished = true;
        expect(gameOne['getStunnablePlayers']()).toEqual(
            expect.arrayContaining(users.map(user => user.id).filter(id => id !== users[0].id))
        );
    });

    it('only returns players that are active', async () => {
        gameOne.players.get(users[0].id)!.isActive = false;
        expect(gameOne['getStunnablePlayers']()).toEqual(
            expect.arrayContaining(users.map(user => user.id).filter(id => id !== users[0].id))
        );
    });

    it('only returns players that are active and not finished', async () => {
        gameOne.players.get(users[0].id)!.isActive = false;
        gameOne.players.get(users[0].id)!.finished = true;
        expect(gameOne['getStunnablePlayers']()).toEqual(
            expect.arrayContaining(users.map(user => user.id).filter(id => id !== users[0].id))
        );
    });
});
