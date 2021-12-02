import User from '../../../src/classes/user';
import { IPlayerRank } from '../../../src/gameplay/interfaces/IPlayerRank';
import { GameType } from '../../../src/gameplay/leaderboard/enums/GameType';
import { LeaderboardInfo } from '../../../src/gameplay/leaderboard/interfaces';
import Leaderboard from '../../../src/gameplay/leaderboard/Leaderboard';
import { roomId, users } from '../mockData';

let leaderboard: Leaderboard;

function createPlayerRanksArray(users: Array<User>, rankArray: Array<number>): Array<IPlayerRank> {
    let rankIndex = 0;
    return users.map((user: User) => {
        return {
            id: user.id,
            name: user.name,
            rank: rankArray[rankIndex++],
            finished: true,
            isActive: true,
        };
    });
}

describe('Create new Leaderboard', () => {
    beforeEach(() => {
        leaderboard = new Leaderboard(roomId);
    });

    // it('Initiates the roomId', async () => {
    //     expect(leaderboard.roomId).toBe(roomId);
    // });

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
        leaderboard = new Leaderboard(roomId);
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
        users.forEach(user => {
            leaderboard.addUser(user.id, user.name);
        });
        expect(leaderboard.userPoints).toMatchObject({
            '1': {
                userId: users[0].id,
                name: users[0].name,
                points: 0,
                rank: 0,
            },
            '2': {
                userId: users[1].id,
                name: users[1].name,
                points: 0,
                rank: 0,
            },
            '3': {
                userId: users[2].id,
                name: users[2].name,
                points: 0,
                rank: 0,
            },
            '4': {
                userId: users[3].id,
                name: users[3].name,
                points: 0,
                rank: 0,
            },
        });
    });
});

describe('Add Game to Game History', () => {
    let playerRanks: Array<IPlayerRank>;
    beforeEach(() => {
        leaderboard = new Leaderboard(roomId);
        users.forEach(user => {
            leaderboard.addUser(user.id, user.name);
        });
        playerRanks = createPlayerRanksArray(users, [1, 2, 3, 4]);
    });

    it('adds the gameType the history object', async () => {
        leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
        expect(leaderboard.gameHistory[0].game).toBe(GameType.GameOne);
    });

    it('adds the playerRanks object to the history object', async () => {
        leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
        expect(leaderboard.gameHistory[0].playerRanks).toMatchObject(playerRanks);
    });

    it('Updates user points object when new points are added with duplicate ranks', async () => {
        leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
        expect(leaderboard.userPoints).toMatchObject({
            '1': {
                points: 5,
            },
            '2': {
                points: 3,
            },
            '3': {
                points: 2,
            },
            '4': {
                points: 1,
            },
        });
    });

    it('adds the new game to end of history array', async () => {
        //add first game
        leaderboard.addGameToHistory(GameType.GameOne, playerRanks);

        //add second game
        const newUserName = 'New Player';
        const playerRanks2 = createPlayerRanksArray([new User('xxx', 'iii', newUserName, 1, '10')], [2, 2, 2, 2]);
        leaderboard.addGameToHistory(GameType.GameOne, playerRanks2);

        expect(leaderboard.gameHistory.length).toBe(2);
        expect(leaderboard.gameHistory[0].playerRanks[0].name).toBe(users[0].name);
        expect(leaderboard.gameHistory[1].playerRanks[0].name).toBe(newUserName);
    });

    describe('Add User Points', () => {
        beforeEach(() => {
            leaderboard = new Leaderboard(roomId);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('Updates user points object when new points are added', async () => {
            const addUserPointsSpy = jest.spyOn(Leaderboard.prototype as any, 'addUserPoints');
            users.forEach(user => {
                leaderboard.addUser(user.id, user.name);
            });
            leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
            expect(addUserPointsSpy).toHaveBeenCalledTimes(playerRanks.length);
            expect(leaderboard.userPoints[users[0].id].points).toBe(
                leaderboard.rankPointsDictionary[playerRanks[0].rank]
            );
        });

        it('Adds and updates user points object when new points are added and user was not yet added', async () => {
            const addUserSpy = jest.spyOn(Leaderboard.prototype as any, 'addUser');
            //check userPoints is empty
            expect(Object.keys(leaderboard.userPoints).length).toBe(0);
            leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
            expect(Object.keys(leaderboard.userPoints).length).toBe(4);
            expect(addUserSpy).toHaveBeenCalledTimes(playerRanks.length);
        });
    });

    describe('Create and add User Points after Game', () => {
        let updateUserPointsAfterGameSpy: any;
        beforeEach(() => {
            leaderboard = new Leaderboard(roomId);
            users.forEach(user => {
                leaderboard.addUser(user.id, user.name);
            });
            updateUserPointsAfterGameSpy = jest.spyOn(Leaderboard.prototype as any, 'updateUserPointsAfterGame');
        });
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('Updates user points object when the first points are added', async () => {
            const playerRanks = createPlayerRanksArray(users, [1, 2, 3, 4]);
            leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
            expect(updateUserPointsAfterGameSpy).toHaveBeenCalledTimes(1);

            // leaderboard.updateUserPointsAfterGame(playerRanks);
            // expect(leaderboard.userPoints[user.id].points).toBe(points);
            expect(leaderboard.userPoints).toMatchObject({
                '1': {
                    points: 5,
                },
                '2': {
                    points: 3,
                },
                '3': {
                    points: 2,
                },
                '4': {
                    points: 1,
                },
            });
        });

        it('does not add points to players that did not finish the game', async () => {
            const playerRanks = createPlayerRanksArray(users, [1, 2, 3, 4]);
            playerRanks[0].finished = false; // player 1
            playerRanks[2].finished = false; // player 3
            leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
            expect(updateUserPointsAfterGameSpy).toHaveBeenCalledTimes(1);

            // leaderboard.updateUserPointsAfterGame(playerRanks);
            // expect(leaderboard.userPoints[user.id].points).toBe(points);
            expect(leaderboard.userPoints).toMatchObject({
                '1': {
                    points: 0,
                },
                '2': {
                    points: 3,
                },
                '3': {
                    points: 0,
                },
                '4': {
                    points: 1,
                },
            });
        });
        it('Updates user points object when new points are added with duplicate ranks', async () => {
            const playerRanks = createPlayerRanksArray(users, [1, 2, 3, 4]);
            leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
            expect(updateUserPointsAfterGameSpy).toHaveBeenCalledTimes(1);

            const playerRanks2 = createPlayerRanksArray(users, [2, 4, 1, 2]);
            leaderboard.addGameToHistory(GameType.GameOne, playerRanks2);
            expect(updateUserPointsAfterGameSpy).toHaveBeenCalledTimes(2);

            expect(leaderboard.userPoints).toMatchObject({
                '1': {
                    points: 5 + 3,
                },
                '2': {
                    points: 3 + 1,
                },
                '3': {
                    points: 2 + 5,
                },
                '4': {
                    points: 1 + 3,
                },
            });
        });
    });
});

describe('Get Leaderboard Info', () => {
    let playerRanks: Array<IPlayerRank>;
    let leaderboardInfo: LeaderboardInfo;
    beforeEach(() => {
        playerRanks = createPlayerRanksArray(users, [2, 1, 4, 3]);
        leaderboard = new Leaderboard(roomId);
        // leaderboard.addUsers(users);
        users.forEach(user => {
            leaderboard.addUser(user.id, user.name);
        });
        leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
        leaderboardInfo = leaderboard.getLeaderboardInfo();
    });

    it('Returns the room id', async () => {
        expect(leaderboardInfo.roomId).toBe(roomId);
    });

    it('Returns the game history', async () => {
        expect(leaderboardInfo.gameHistory[0].game).toBe(GameType.GameOne);
        expect(leaderboardInfo.gameHistory[0].playerRanks).toMatchObject(playerRanks);
    });

    it.todo('test ranks');

    it('Returns the userPointsArray (sorted by points)', async () => {
        expect(leaderboardInfo.userPoints).toMatchObject([
            {
                userId: users[1].id,
                name: users[1].name,
                points: 5,
            },
            {
                userId: users[0].id,
                name: users[0].name,
                points: 3,
            },
            {
                userId: users[3].id,
                name: users[3].name,
                points: 2,
            },
            {
                userId: users[2].id,
                name: users[2].name,
                points: 1,
            },
        ]);
    });
});

describe('Get Leaderboard Info Error No Game History', () => {
    let playerRanks: Array<IPlayerRank>;
    let leaderboardInfo: LeaderboardInfo;
    beforeEach(() => {
        playerRanks = createPlayerRanksArray(users, [1, 2, 3, 4]);
        leaderboard = new Leaderboard(roomId);
        users.forEach(user => {
            leaderboard.addUser(user.id, user.name);
        });
    });

    it('Returns a copy of the game history object', async () => {
        leaderboardInfo = leaderboard.getLeaderboardInfo();
        leaderboard.addGameToHistory(GameType.GameOne, playerRanks);
        expect(leaderboardInfo.gameHistory).toMatchObject([]);
    });
});
