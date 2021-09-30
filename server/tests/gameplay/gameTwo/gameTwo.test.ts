import 'reflect-metadata';
import { GameTwo } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/enums';
import InitialParameters from '../../../src/gameplay/gameTwo/constants/InitialParameters';
import { leaderboard, roomId, users } from '../mockData';
import { GameTwoMessageTypes } from '../../../src/gameplay/gameTwo/enums/GameTwoMessageTypes';
import Sheep from '../../../src/gameplay/gameTwo/classes/Sheep';
import { SheepStates } from '../../../src/gameplay/gameTwo/enums/SheepStates';

let gameTwo: GameTwo;

describe('GameTwo Tests', () => {
    beforeEach(async () => {
        gameTwo = new GameTwo(roomId, leaderboard);
        jest.useFakeTimers();

        gameTwo.createNewGame(users);
        gameTwo.startGame();
        jest.advanceTimersByTime(gameTwo.countdownTime);
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
        expect(gameTwo.sheep.length).toBe(InitialParameters.SHEEP_COUNT);
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

    it('should move the player if message is sent', async () => {
        const message = {
            type: GameTwoMessageTypes.MOVE,
            roomId: roomId,
            direction: 'S',
            userId: users[0].id
        };
        gameTwo.receiveInput(message);

        jest.useRealTimers();

        setTimeout(() => {
            expect(gameTwo.getGameStateInfo().playersState[0].positionY).toBeGreaterThan(InitialParameters.PLAYERS_POSITIONS[0].y);
        }, 1500);

    });

    it('should kill sheep if message is sent and user is in radius', async () => {
        const sheep = new Sheep(InitialParameters.PLAYERS_POSITIONS[0].x, InitialParameters.PLAYERS_POSITIONS[0].y, gameTwo.sheep.length);
        gameTwo.sheep.push(sheep);

        const message = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(message);
        expect(gameTwo.sheep[sheep.id].state).toEqual(SheepStates.DECOY);
    });

    it('should kill sheep if user has no kills left', async () => {
        if (gameTwo.players.get(users[0].id)) {
            gameTwo.players.get(users[0].id)?.setKillsLeft(0);
        }

        const sheep = new Sheep(InitialParameters.PLAYERS_POSITIONS[0].x, InitialParameters.PLAYERS_POSITIONS[0].y, gameTwo.sheep.length);
        gameTwo.sheep.push(sheep);

        const message = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(message);
        expect(gameTwo.sheep[sheep.id].state).toEqual(SheepStates.ALIVE);
    });

    it('should not kill sheep if user is not in radius', async () => {
        const message = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(message);

        const decoySheep = gameTwo.sheep.filter(sheep => {
            return sheep.state === SheepStates.DECOY;
        })
        expect(decoySheep.length).toEqual(0);
    });
    it('should log a message if it is not implemented', async () => {
        console.info = jest.fn();
        const message = {
            type: 'test',
        }
        gameTwo.receiveInput(message);
        expect(console.info).toHaveBeenCalledWith(message);
    });


    it('should log a message if it is not implemented', async () => {
        gameTwo.stopGame();
        let posX = gameTwo.players.get(users[0].id)?.posX;
        if (!posX){
            posX = 0;
        }

        let posY = gameTwo.players.get(users[0].id)?.posY;
        if (!posY){
            posY = 0;
        }
        gameTwo.players.get(users[0].id)?.setDirection('E');
        gameTwo.players.get(users[0].id)?.update(0,1);


        expect(gameTwo.players.get(users[0].id)?.posX).toBeGreaterThan(posX);

        gameTwo.players.get(users[0].id)?.setDirection('S');
        gameTwo.players.get(users[0].id)?.update(1,1);

        expect(gameTwo.players.get(users[0].id)?.posY).toBeGreaterThan(posY);

        posX = gameTwo.players.get(users[0].id)?.posX;
        if (!posX){
            posX = 0;
        }

        posY = gameTwo.players.get(users[0].id)?.posY;
        if (!posY){
            posY = 0;
        }
        gameTwo.players.get(users[0].id)?.setDirection('W');
        gameTwo.players.get(users[0].id)?.update(0,1);


        expect(gameTwo.players.get(users[0].id)?.posX).toBeLessThan(posX);

        gameTwo.players.get(users[0].id)?.setDirection('N');
        gameTwo.players.get(users[0].id)?.update(1,1);

        expect(gameTwo.players.get(users[0].id)?.posY).toBeLessThan(posY);

    });
});
