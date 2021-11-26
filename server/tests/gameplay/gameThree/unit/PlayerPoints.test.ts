import 'reflect-metadata';

import { PlayerPoints } from '../../../../src/gameplay/gameThree/classes/PlayerPoints';
import { PlayerNameId } from '../../../../src/gameplay/gameThree/interfaces';
import { users } from '../../mockData';

let playerPoints: PlayerPoints;
const points = 50;
const players: PlayerNameId[] = users.map(user => {
    return { id: user.id, name: user.name };
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
});

describe('Add Points To All Player', () => {
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

        playerPoints2.addAllPlayerPoints(playerPoints.getAllPlayerPoints());

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

        playerPoints2.addAllPlayerPoints(playerPoints.getAllPlayerPoints());

        expect(playerPoints2.getPointsFromPlayer(users[0].id)).toBe(
            playerPoints.getPointsFromPlayer(users[0].id) + newPoints
        );
        expect(playerPoints2.getPointsFromPlayer(users[1].id)).toBe(
            playerPoints.getPointsFromPlayer(users[1].id) + newPoints * 2
        );
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
