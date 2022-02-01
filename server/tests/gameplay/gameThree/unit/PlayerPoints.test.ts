import 'reflect-metadata';

import { PlayerPoints } from '../../../../src/gameplay/gameThree/classes/PlayerPoints';
import { PlayerNameId } from '../../../../src/gameplay/gameThree/interfaces';
import { users } from '../../mockData';

let playerPoints: PlayerPoints;
const points = 50;
const players: PlayerNameId[] = users.map(user => {
    return { id: user.id, name: user.name, isActive: true };
});

describe('Add Points To Player', () => {
    beforeEach(() => {
        playerPoints = new PlayerPoints(players);
    });

    it('should initiate player with 0 points', async () => {
        expect(playerPoints.getPointsFromPlayer(users[0].id)).toBe(0);
    });

    it('should add points to player', async () => {
        playerPoints.addPointsToPlayer(users[0].id, points);
        expect(playerPoints.getPointsFromPlayer(users[0].id)).toBe(points);
    });

    it('should not add points to non existent player', async () => {
        const fakeUserId = 'xxxxxxxx';
        playerPoints.addPointsToPlayer(fakeUserId, points);
        expect(playerPoints.getPointsFromPlayer(fakeUserId)).toBe(0);
    });
});

describe('Add Points to multiple players', () => {
    beforeEach(() => {
        playerPoints = new PlayerPoints(players);
        playerPoints.addPointsToPlayer(users[0].id, points);
        playerPoints.addPointsToPlayer(users[1].id, points * 2);
    });

    it('should not add any new points when undefined is passed', async () => {
        playerPoints.addPointsToMultiplePlayers(undefined);

        expect(playerPoints.getPointsFromPlayer(users[0].id)).toBe(points);
        expect(playerPoints.getPointsFromPlayer(users[1].id)).toBe(points * 2);
        for (let i = 2; i < users.length; i++) {
            expect(playerPoints.getPointsFromPlayer(users[i].id)).toBe(0);
        }
    });

    it('should initiate player with 0 points', async () => {
        const newPoints = 30;
        const playerPoints2 = new PlayerPoints(players);
        playerPoints2.addPointsToPlayer(users[0].id, newPoints);
        playerPoints2.addPointsToPlayer(users[1].id, newPoints * 2);

        playerPoints2.addPointsToMultiplePlayers(playerPoints.getAllPlayerPoints());

        expect(playerPoints2.getPointsFromPlayer(users[0].id)).toBe(
            playerPoints.getPointsFromPlayer(users[0].id) + newPoints
        );
        expect(playerPoints2.getPointsFromPlayer(users[1].id)).toBe(
            playerPoints.getPointsFromPlayer(users[1].id) + newPoints * 2
        );
    });
});

describe('Get all player points', () => {
    beforeEach(() => {
        playerPoints = new PlayerPoints(players);
        playerPoints.addPointsToPlayer(users[0].id, points);
        playerPoints.addPointsToPlayer(users[1].id, points * 2);
    });

    it('should initiate player with 0 points', async () => {
        const newPoints = 30;
        const playerPoints2 = new PlayerPoints(players);
        playerPoints2.addPointsToPlayer(users[0].id, newPoints);
        playerPoints2.addPointsToPlayer(users[1].id, newPoints * 2);

        playerPoints2.addPointsToMultiplePlayers(playerPoints.getAllPlayerPoints());

        expect(playerPoints2.getPointsFromPlayer(users[0].id)).toBe(
            playerPoints.getPointsFromPlayer(users[0].id) + newPoints
        );
        expect(playerPoints2.getPointsFromPlayer(users[1].id)).toBe(
            playerPoints.getPointsFromPlayer(users[1].id) + newPoints * 2
        );
    });

    it('should not add points for a player that does not exist', async () => {
        const newPoints = 30;
        const fakeUserId = 'xxxxxx';
        const playerPoints2 = new PlayerPoints([{ id: fakeUserId, name: 'James P. Not Me', isActive: true }]);
        playerPoints2.addPointsToPlayer(fakeUserId, newPoints);

        playerPoints.addPointsToMultiplePlayers(playerPoints2.getAllPlayerPoints());

        expect(playerPoints.getPointsFromPlayer(fakeUserId)).toBe(0);
    });
});

describe('Get All Player Points', () => {
    beforeEach(() => {
        playerPoints = new PlayerPoints(players);
        playerPoints.addPointsToPlayer(users[0].id, points);
        playerPoints.addPointsToPlayer(users[1].id, points * 2);
    });

    it('should return correct player points for user 0', async () => {
        expect(playerPoints.getAllPlayerPoints().get(users[0].id)).toBe(points);
    });

    it('should return correct player points for user 1', async () => {
        expect(playerPoints.getAllPlayerPoints().get(users[1].id)).toBe(points * 2);
    });

    it('should return correct player points for user 3', async () => {
        expect(playerPoints.getAllPlayerPoints().get(users[2].id)).toBe(0);
    });
});
