import 'reflect-metadata';
import { GameTwo } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import Parameters from '../../../../src/gameplay/gameTwo/constants/Parameters';
import { leaderboard, roomId, users } from '../../mockData';
import { GameTwoMessageTypes } from '../../../../src/gameplay/gameTwo/enums/GameTwoMessageTypes';
import Sheep from '../../../../src/gameplay/gameTwo/classes/Sheep';
import { SheepStates } from '../../../../src/gameplay/gameTwo/enums/SheepStates';
// import { Direction } from '../../../src/gameplay/gameTwo/enums/Direction';

let gameTwo: GameTwo;

describe('GameTwo Tests', () => {
    beforeEach(async () => {
        jest.spyOn(console, "log").mockImplementation();
        gameTwo = new GameTwo(roomId, leaderboard);
        jest.useFakeTimers();

        gameTwo.createNewGame(users);
        gameTwo.startGame();
        jest.advanceTimersByTime(gameTwo.countdownTime);
    });

    afterEach(() => {
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

    // it('should move the player if message is sent', async () => {
    //     const message = {
    //         type: GameTwoMessageTypes.MOVE,
    //         roomId: roomId,
    //         direction: 'S',
    //         userId: users[0].id
    //     };
    //     gameTwo.receiveInput(message);

    //     jest.useRealTimers();

    //     setTimeout(() => {
    //         expect(gameTwo.getGameStateInfo().playersState[0].positionY).toBeGreaterThan(Parameters.PLAYERS_POSITIONS[0].y);
    //     }, 2000);

    // });

    it('should kill sheep if message is sent and user is in radius', async () => {
        const sheep = new Sheep(Parameters.PLAYERS_POSITIONS[0].x, Parameters.PLAYERS_POSITIONS[0].y, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep);

        const message = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(message);
        expect(gameTwo.sheepService.sheep[sheep.id].state).toEqual(SheepStates.DECOY);
    });


    it('should kill the closer sheep if two sheep are in radius', async () => {
        const sheep = new Sheep(Parameters.PLAYERS_POSITIONS[0].x + Parameters.KILL_RADIUS - 1, Parameters.PLAYERS_POSITIONS[0].y + Parameters.KILL_RADIUS - 1, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep);

        const sheep2 = new Sheep(Parameters.PLAYERS_POSITIONS[0].x + Parameters.KILL_RADIUS, Parameters.PLAYERS_POSITIONS[0].y + Parameters.KILL_RADIUS, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep2);

        const sheep3 = new Sheep(Parameters.PLAYERS_POSITIONS[0].x + Parameters.KILL_RADIUS - 2, Parameters.PLAYERS_POSITIONS[0].y + Parameters.KILL_RADIUS - 2, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep3);

        const message = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(message);
        expect(gameTwo.sheepService.sheep[sheep3.id].state).toEqual(SheepStates.DECOY);
    });

    it('should kill sheep if user has no kills left', async () => {
        if (gameTwo.players.get(users[0].id)) {
            gameTwo.players.get(users[0].id)?.setKillsLeft(0);
        }

        const sheep = new Sheep(Parameters.PLAYERS_POSITIONS[0].x, Parameters.PLAYERS_POSITIONS[0].y, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep);

        const message = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(message);
        expect(gameTwo.sheepService.sheep[sheep.id].state).toEqual(SheepStates.ALIVE);
    });

    it('should not kill sheep if user is not in radius', async () => {
        const message = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(message);

        const decoySheep = gameTwo.sheepService.sheep.filter(sheep => {
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

    // TODO: fix flakyness
    // it('should return to previous state if moving one step in every direction', async () => {
    //     gameTwo.stopGame();
    //     let posX = gameTwo.players.get(users[0].id)?.posX;
    //     if (!posX){
    //         posX = 0;
    //     }

    //     let posY = gameTwo.players.get(users[0].id)?.posY;
    //     if (!posY){
    //         posY = 0;
    //     }
    //     gameTwo.players.get(users[0].id)?.setDirection(Direction.RIGHT);
    //     gameTwo.players.get(users[0].id)?.update(0,1);

    //     gameTwo.players.get(users[0].id)?.setDirection(Direction.DOWN);
    //     gameTwo.players.get(users[0].id)?.update(1,1);

    //     gameTwo.players.get(users[0].id)?.setDirection(Direction.LEFT);
    //     gameTwo.players.get(users[0].id)?.update(2,1);

    //     gameTwo.players.get(users[0].id)?.setDirection(Direction.UP);
    //     gameTwo.players.get(users[0].id)?.update(3,1);

    //     expect(gameTwo.players.get(users[0].id)?.posY).toEqual(posY);
    //     expect(gameTwo.players.get(users[0].id)?.posX).toEqual(posX);
    // });
    // it('should stop at the bottom of the screen', async () => {
    //     gameTwo.stopGame();

    //     gameTwo.players.get(users[0].id)?.setDirection(Direction.DOWN);

    //     for(let i = 0; i < Parameters.LENGTH_Y + 10; i++){
    //         gameTwo.players.get(users[0].id)?.update(i,1);

    //     }
    //     expect(gameTwo.players.get(users[0].id)?.posY).toEqual(Parameters.LENGTH_Y);
    // });

    // it('should stop at the top of the screen', async () => {
    //     gameTwo.stopGame();

    //     gameTwo.players.get(users[0].id)?.setDirection(Direction.UP);

    //     for(let i = 0; i < 200; i++){
    //         gameTwo.players.get(users[0].id)?.update(i,1);

    //     }
    //     expect(gameTwo.players.get(users[0].id)?.posY).toEqual(0);
    // });

    // it('should stop at the left edge of the screen', async () => {
    //     gameTwo.stopGame();

    //     gameTwo.players.get(users[0].id)?.setDirection(Direction.LEFT);

    //     for(let i = 0; i < 200; i++){
    //         gameTwo.players.get(users[0].id)?.update(i,1);

    //     }
    //     expect(gameTwo.players.get(users[0].id)?.posX).toEqual(0);
    // });
    // it('should stop at the right edge of the screen', async () => {
    //     gameTwo.stopGame();

    //     gameTwo.players.get(users[0].id)?.setDirection(Direction.RIGHT);

    //     for(let i = 0; i < Parameters.LENGTH_X + 10; i++){
    //         gameTwo.players.get(users[0].id)?.update(i,1);

    //     }
    //     expect(gameTwo.players.get(users[0].id)?.posX).toEqual(Parameters.LENGTH_X);
    // });
});
