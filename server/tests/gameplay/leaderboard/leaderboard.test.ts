import User from '../../../src/classes/user';
import { IPlayerRank } from '../../../src/gameplay/interfaces/IPlayerRank';
import Leaderboard from '../../../src/gameplay/leaderboard/Leaderboard';
import { users } from '../mockUsers';

let leaderboard: Leaderboard;
const ROOM_ID = '###';

describe('Create new Leaderboard', () => {
    beforeEach(() => {
        leaderboard = new Leaderboard(ROOM_ID);
    });

    it('Initiates the roomId', async () => {
        expect(leaderboard.roomId).toBe(ROOM_ID);
    });

    it('Initiates gameHistory', async () => {
        expect(leaderboard.gameHistory).toMatchObject([]);
    });

    it('Initiates userPoints', async () => {
        expect(leaderboard.userPoints).toMatchObject({});
    });
});

describe('Add user(s)', () => {
    const user = users[0];

    beforeEach(() => {
        leaderboard = new Leaderboard(ROOM_ID);
    });

    it('Adds a new user with correct id', async () => {
        leaderboard.addUser(user.id, user.name);
        expect(leaderboard.userPoints[user.id].userId).toBe(user.id);
    });

    it('Adds a new user with correct name', async () => {
        leaderboard.addUser(user.id, user.name);
        expect(leaderboard.userPoints[user.id].name).toBe(user.name);
    });

    it('Adds a new user with 0 points', async () => {
        leaderboard.addUser(user.id, user.name);
        expect(leaderboard.userPoints[user.id].points).toBe(0);
    });

    it('Adds multiple users', async () => {
        leaderboard.addUsers(users);
        expect(leaderboard.userPoints).toMatchObject({
            '1': {
                userId: users[0].id,
                name: users[0].name,
                points: 0,
            },
            '2': {
                userId: users[1].id,
                name: users[1].name,
                points: 0,
            },
            '3': {
                userId: users[2].id,
                name: users[2].name,
                points: 0,
            },
            '4': {
                userId: users[3].id,
                name: users[3].name,
                points: 0,
            },
        });
    });

    describe('Add User Points', () => {
        const user = users[0];
        const points = 10;
        beforeEach(() => {
            leaderboard = new Leaderboard(ROOM_ID);
            leaderboard.addUsers(users);
        });

        it('Updates user points object when new points are added', async () => {
            leaderboard.addUserPoints(user.id, points);
            expect(leaderboard.userPoints[user.id].points).toBe(points);
        });
    });

    describe('Create and add User Points after Game', () => {
        // const user = users[0];
        // const points = 10;

        beforeEach(() => {
            leaderboard = new Leaderboard(ROOM_ID);
            leaderboard.addUsers(users);
        });

        it('Updates user points object when new points are added', async () => {
            let rankCounter = 1;
            const playerRanks: Array<IPlayerRank> = users.map((user: User) => {
                return {
                    id: user.id,
                    name: user.name,
                    rank: rankCounter++,
                    finished: true,
                };
            });
            leaderboard.updateUserPointsAfterGame(playerRanks);
            // expect(leaderboard.userPoints[user.id].points).toBe(points);
        });

        //TODO test that catchfood game calls it then
    });
});
