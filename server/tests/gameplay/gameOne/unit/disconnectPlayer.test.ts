import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { leaderboard, roomId, users } from '../../mockData';

// const TRACK_LENGTH = 500;

let gameOne: GameOne;

describe('Disconnect Player tests', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    it('disconnectPlayer should initialise player isActive as true', async () => {
        expect(gameOne.players.get('1')?.isActive).toBeTruthy();
    });

    it('disconnectPlayer should set player isActive to false', async () => {
        gameOne.disconnectPlayer('1');
        expect(gameOne.players.get('1')?.isActive).toBeFalsy();
    });
});
