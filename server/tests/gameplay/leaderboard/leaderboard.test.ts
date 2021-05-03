// import { CatchFoodGame } from '../../../src/gameplay';
import Leaderboard from '../../../src/gameplay/leaderboard/Leaderboard';
import { users } from '../mockUsers';

// let catchFoodGame: CatchFoodGame;
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
    beforeEach(() => {
        leaderboard = new Leaderboard(ROOM_ID);
    });

    it('Adds a new user with correct id', async () => {
        const user = users[0];
        leaderboard.addUser(user.id, user.name);
        expect(leaderboard.userPoints[user.id].userId).toBe(user.id);
    });

    it('Adds a new user with correct name', async () => {
        const user = users[0];
        leaderboard.addUser(user.id, user.name);
        expect(leaderboard.userPoints[user.id].name).toBe(user.name);
    });

    it('Adds a new user with 0 points', async () => {
        const user = users[0];
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
});
