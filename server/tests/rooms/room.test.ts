import Room from '../../src/classes/room';
import User from '../../src/classes/user';
import { GameAlreadyStartedError } from '../../src/customErrors';
import CannotStartEmptyGameError from '../../src/customErrors/CannotStartEmptyGameError';
import { Globals } from '../../src/enums/globals';
import { MaxNumberUsersExceededError } from '../../src/gameplay/customErrors';
import { clearTimersAndIntervals } from '../gameplay/catchFoodGame/gameHelperFunctions';

describe('Room ID', () => {
    it("creates a room with id 'ABCD'", () => {
        const room = new Room('ABCD');
        expect(room.id).toEqual('ABCD');
    });
});

describe('Room: Users', () => {
    let room: Room;
    const roomId = 'ABCD';
    let user1: User;
    let user2: User;

    beforeEach(done => {
        room = new Room(roomId);
        user1 = new User(room.id, '1', 'Robert');
        user2 = new User(room.id, '2', 'Johannes');
        room.addUser(user1);
        room.addUser(user2);
        done();
    });

    it('should have one player after two users join and one leaves', () => {
        expect(room.users[0]).toEqual(user1);
        room.userDisconnected(user1.id);
        expect(room.users.length).toEqual(1);
    });

    it('should close the room if all players leave during a game', () => {
        jest.useFakeTimers();
        user1.setReady(true);
        user2.setReady(true);

        room.startGame();
        setTimeout(() => {
            room.userDisconnected(user1.id);
            expect(room.isClosed()).toEqual(false);
            room.userDisconnected(user2.id);
            expect(room.isClosed()).toEqual(true);
        }, room.game.countdownTime);
        clearTimersAndIntervals(room.game);
        jest.runAllTimers();
    });
    it('should label a player inactive after leaving a running game', () => {
        jest.useFakeTimers();
        user1.setReady(true);
        user2.setReady(true);
        room.startGame();

        setTimeout(() => {
            room.userDisconnected(user1.id);
            expect(user1.active).toEqual(false);
        }, 3000);
        clearTimersAndIntervals(room.game);
        jest.runAllTimers();
    });
    it('should remove inactive players after room is restarted', () => {
        jest.useFakeTimers();
        user1.setReady(true);
        user2.setReady(true);
        room.startGame();
        setTimeout(() => {
            room.userDisconnected(user1.id);
            room.resetGame();
            expect(room.users).not.toContain(user1);
        }, 3000);
        clearTimersAndIntervals(room.game);
        jest.runAllTimers();
    });
    it('should return a user count of 2 after 2 players joined', () => {
        expect(room.getUserCount()).toStrictEqual(2);
    });
    it('should throw an MaxNumberUsersExceededError if a player wants to join a full room', () => {
        for (let i = 2; i < Globals.MAX_PLAYER_NUMBER; i++) {
            room.addUser(new User(room.id, i.toString(), 'User'));
        }
        expect(() => {
            room.addUser(new User(room.id, '999', 'User'));
        }).toThrow(MaxNumberUsersExceededError);
    });

    it('number of first player should be 1 and number of second player 2', () => {
        expect(user1.number).toStrictEqual(1);
        expect(user2.number).toStrictEqual(2);
    });

    it('number of second player should be 1 if first player is removed', () => {
        room.removeUser(user1);
        expect(user2.number).toStrictEqual(1);
    });

    it('should throw an GameAlreadyStartedError if a player wants to join game that has already started', () => {
        user1.setReady(true);
        user2.setReady(true);
        room.startGame();
        expect(() => {
            const user3 = new User(room.id, '999', 'User');
            room.addUser(user3);
        }).toThrow(GameAlreadyStartedError);
    });
    it('should throw an CannotStartEmptyGameError if a game without players is started', () => {
        room.removeUser(user1);
        room.removeUser(user2);
        expect(() => {
            room.startGame();
        }).toThrow(CannotStartEmptyGameError);
    });
});
