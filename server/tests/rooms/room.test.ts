import 'reflect-metadata';

import { CharacterNotAvailableError, GameAlreadyStartedError, UsersNotReadyError } from '../../src/customErrors';
import { GameOne, GameThree, GameTwo } from '../../src/gameplay';
import { clearTimersAndIntervals } from '../gameplay/gameOne/gameOneHelperFunctions';
import Room, { RoomStates } from '../../src/classes/room';
import User from '../../src/classes/user';
import CannotStartEmptyGameError from '../../src/customErrors/CannotStartEmptyGameError';
import { GameNames } from '../../src/enums/gameNames';
import { Globals } from '../../src/enums/globals';
import { ScreenStates } from '../../src/enums/screenStates';
import Game from '../../src/gameplay/Game';
import { MaxNumberUsersExceededError } from '../../src/gameplay/customErrors';
import { GameState } from '../../src/gameplay/enums';
import Parameters from '../../src/gameplay/gameTwo/constants/Parameters';

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

        room.createNewGame();
        room.startGame();
        setTimeout(() => {
            room.userDisconnected(user1.id);
            expect(room.isClosed()).toEqual(false);
            room.userDisconnected(user2.id);
            expect(room.isClosed()).toEqual(true);
        }, (room.game as GameOne).countdownTime || 0);
        clearTimersAndIntervals(room.game);
        jest.runAllTimers();
    });
    it('should label a player inactive after leaving a running game', () => {
        jest.useFakeTimers();
        user1.setReady(true);
        user2.setReady(true);
        room.createNewGame();
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
        room.createNewGame();
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
        room.createNewGame();
        expect(() => {
            const user3 = new User(room.id, '999', 'User');
            room.addUser(user3);
        }).toThrow(GameAlreadyStartedError);
    });

    it('should throw an CannotStartEmptyGameError if a game without players is started', () => {
        room.removeUser(user1);
        room.removeUser(user2);
        expect(() => {
            room.createNewGame();
        }).toThrow(CannotStartEmptyGameError);
    });

    it('should throw an UsersNotReadyError if a game without players is started', () => {
        room.removeUser(user1);

        expect(() => {
            room.createNewGame();
        }).toThrow(UsersNotReadyError);
    });

    it('should have the right game instance on game set', () => {
        room.setGame(GameNames.GAME1);
        expect(room.game).toBeInstanceOf(GameOne);

        room.setGame(GameNames.GAME2);
        expect(room.game).toBeInstanceOf(GameTwo);

        room.setGame(GameNames.GAME3);
        expect(room.game).toBeInstanceOf(GameThree);
    });

    it('should call setState created on game creation', () => {
        user1.setReady(true);
        user2.setReady(true);

        const setState = jest.spyOn(Room.prototype, "setState");

        room.createNewGame();
        expect(setState).toHaveBeenCalledWith(RoomStates.CREATED);
        expect(room.isCreated()).toBeTruthy();

        setState.mockClear();
    });

    it('should call stopGameUserClosed on stopGame', () => {
        user1.setReady(true);
        user2.setReady(true);

        const stopGameUserClosed = jest.spyOn(Game.prototype, "stopGameUserClosed");
        room.setGame(GameNames.GAME2);
        room.createNewGame();

        room.startGame();
        jest.useFakeTimers();

        jest.advanceTimersByTime(Parameters.COUNTDOWN_TIME)

        room.stopGame();
        expect(stopGameUserClosed).toHaveBeenCalled()
        stopGameUserClosed.mockClear();
    });

    it('should have game with gameState Paused on pauseGame', () => {
        user1.setReady(true);
        user2.setReady(true);

        room.setGame(GameNames.GAME2);
        room.createNewGame();

        room.startGame();
        jest.useFakeTimers();

        jest.advanceTimersByTime(Parameters.COUNTDOWN_TIME)

        room.pauseGame();
        expect(room.game.gameState).toEqual(GameState.Paused)
    });

    it('should have game with gameState Started on resumeGame', () => {
        user1.setReady(true);
        user2.setReady(true);

        room.setGame(GameNames.GAME2);
        room.createNewGame();

        room.startGame();
        jest.useFakeTimers();

        jest.advanceTimersByTime(Parameters.COUNTDOWN_TIME)

        room.pauseGame();
        room.resumeGame();

        expect(room.game.gameState).toEqual(GameState.Started)
    });

    it('should call clear on resetGame', () => {
        user1.setActive(false);
        user2.setReady(true);
        const clear = jest.spyOn(User.prototype, "clear");

        room.resetGame();
        expect(clear).toHaveBeenCalled()
        clear.mockClear();
    });


    it('isFinished should return true after setFinished', () => {
        expect(room.isFinished()).toBeFalsy();
        room.setFinished();
        expect(room.isFinished()).toBeTruthy();
    });

    it('isPaused should return true after setPaused', () => {
        expect(room.isPaused()).toBeFalsy();
        room.setPaused();
        expect(room.isPaused()).toBeTruthy();
    });

    it('should throw an CharacterNotAvailableError a chosen character is not available', () => {
        room.setUserCharacter(user1, 1);
        expect(() => {
            room.setUserCharacter(user2, 1);
        }).toThrow(CharacterNotAvailableError);
    });

    it('should get the right admin screen id', () => {
        expect(room.getAdminScreenId()).toEqual(undefined);
        room.addScreen('one');
        expect(room.getAdminScreenId()).toEqual('one');
        room.addScreen('two');
        expect(room.getAdminScreenId()).toEqual('one');
    });

    it('should be able to set and get a screen state', () => { 
        room.setScreenState(ScreenStates.LOBBY);
        expect(room.getScreenState()).toEqual(ScreenStates.LOBBY);
    });
});
