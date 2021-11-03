import 'reflect-metadata';

import { leaderboard, roomId, users } from '../mockData';
import { MockGameClass } from '../mockGameClass';

let game: MockGameClass;

describe('Initiates game correctly', () => {
    beforeEach(async () => {
        game = new MockGameClass(roomId, leaderboard);
        game.createNewGame(users);
    });

    it('initiates players state with correct number of players', async () => {
        expect(game.players.size).toBe(users.length);
    });

    it('initiates currentRank with correct number', async () => {
        expect(game['currentRank']).toBe(1);
    });

    it('initiates _currentBackRank with correct number', async () => {
        expect(game['_currentBackRank']).toBe(users.length);
    });

    it('initiates roomId with correct room', async () => {
        expect(game.roomId).toBe(users[0].roomId);
    });

    it('initiates first player with the correct name', async () => {
        expect(game.players.get('1')!.name).toBe(users[0].name);
    });

    it('initiates player as not finished', async () => {
        expect(game.players.get('1')!.finished).toBeFalsy();
    });

    it('initiates character number', async () => {
        expect(game.players.get('1')!.characterNumber).toBe(users[0].characterNumber);
    });

    it('initiates rank', async () => {
        expect(game.players.get('1')!.rank).toBe(0);
    });
});
