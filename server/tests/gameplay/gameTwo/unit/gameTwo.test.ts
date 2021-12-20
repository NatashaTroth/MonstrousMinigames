import 'reflect-metadata';

import { leaderboard, roomId, usersWithNumbers } from '../../mockData';
import { GameTwo } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import Parameters from '../../../../src/gameplay/gameTwo/constants/Parameters';

let gameTwo: GameTwo;
const users = usersWithNumbers;

describe('GameTwo Unit Tests', () => {
    beforeEach(async () => {
        jest.spyOn(console, "log").mockImplementation();
        gameTwo = new GameTwo(roomId, leaderboard);
        jest.useFakeTimers();

        gameTwo.createNewGame(users);
        gameTwo.startGame();
        jest.advanceTimersByTime(gameTwo.countdownTime);
    });

    afterEach(() => {
        jest.clearAllTimers();
        gameTwo.cleanup();
    });

    it('should have the correct new number of players', async () => {
        expect(gameTwo.players.size).toBe(users.length);
    });

    it('should have the correct current rank', async () => {
        expect(gameTwo['currentRank']).toBe(1);
    });

    it('should have the correct name for player 1', async () => {
        expect(gameTwo.players.get('1')!.name).toBe(users[0].name);
    });

    it('should have the correct amount of sheep', async () => {
        expect(gameTwo.sheepService.sheep.length).toBe(Parameters.SHEEP_COUNT);
    });

    it('should set a user inactive after disconnecting', async () => {
        const user = users[0];
        gameTwo.disconnectPlayer(user.id);

        expect(gameTwo.players.get(user.id)?.isActive).toEqual(false);
    });

    it('should return false if trying to disconnect inactive player', async () => {
        const user = users[0];
        gameTwo.disconnectPlayer(user.id);

        expect(gameTwo.disconnectPlayer(user.id)).toEqual(false);
    });

    it('should set a user active after reconnecting', async () => {
        const user = users[0];
        gameTwo.disconnectPlayer(user.id);
        gameTwo.reconnectPlayer(user.id);

        expect(gameTwo.players.get(user.id)?.isActive).toEqual(true);
    });

    it('should return false if trying to reconnect active player', async () => {
        const user = users[0];

        expect(gameTwo.reconnectPlayer(user.id)).toEqual(false);
    });

    it('should have a started GameState after starting', async () => {
        expect(gameTwo.gameState).toEqual(GameState.Started);
    });

    it('should have a paused GameState after pausing', async () => {
        gameTwo.pauseGame();
        expect(gameTwo.gameState).toEqual(GameState.Paused);
    });

    it('should have a stopped GameState after stopping', async () => {
        gameTwo.stopGame();
        expect(gameTwo.gameState).toEqual(GameState.Stopped);
    });

    it('should have a started GameState after resuming', async () => {
        gameTwo.pauseGame();
        gameTwo.resumeGame();

        expect(gameTwo.gameState).toEqual(GameState.Started);
    });
    it('should have a stopped GameState after all players disconnected', async () => {
        users.forEach(user => {
            gameTwo.disconnectPlayer(user.id);
        });

        expect(gameTwo.gameState).toEqual(GameState.Stopped);
    });

    it('should have a stopped GameState if closed by user', async () => {
        gameTwo.stopGameUserClosed();

        expect(gameTwo.gameState).toEqual(GameState.Stopped);
    });

    it('should log a message if it is not implemented', async () => {
        console.info = jest.fn();
        const message = {
            type: 'test',
        }
        gameTwo.receiveInput(message);
        expect(console.info).toHaveBeenCalledWith(message);
    });

});
