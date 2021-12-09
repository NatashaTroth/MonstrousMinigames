import 'reflect-metadata';

import { leaderboard, roomId, users } from '../../mockData';
import { GameTwo } from '../../../../src/gameplay';
import Parameters from '../../../../src/gameplay/gameTwo/constants/Parameters';
import { Direction } from '../../../../src/gameplay/gameTwo/enums/Direction';
import { GameTwoMessageTypes } from '../../../../src/gameplay/gameTwo/enums/GameTwoMessageTypes';
import { Phases } from '../../../../src/gameplay/gameTwo/enums/Phases';

let gameTwo: GameTwo;

describe('GameTwo Movement Tests', () => {
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

    // todo fix flakyness
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
    //     }, 3000);
    // });

    it('should return to previous state if moving one step in every direction', async () => {
        let posX = gameTwo.players.get(users[0].id)?.posX;
        if (!posX) {
            posX = 0;
        }

        let posY = gameTwo.players.get(users[0].id)?.posY;
        if (!posY) {
            posY = 0;
        }
        gameTwo.players.get(users[0].id)?.setDirection(Direction.RIGHT);
        gameTwo.players.get(users[0].id)?.update(0, 1);

        gameTwo.players.get(users[0].id)?.setDirection(Direction.DOWN);
        gameTwo.players.get(users[0].id)?.update(1, 1);

        gameTwo.players.get(users[0].id)?.setDirection(Direction.LEFT);
        gameTwo.players.get(users[0].id)?.update(2, 1);

        gameTwo.players.get(users[0].id)?.setDirection(Direction.UP);
        gameTwo.players.get(users[0].id)?.update(3, 1);

        expect(gameTwo.players.get(users[0].id)?.posY).toEqual(posY);
        expect(gameTwo.players.get(users[0].id)?.posX).toEqual(posX);
    });
    it('should stop at the bottom of the screen', async () => {
        gameTwo.players.get(users[0].id)?.setDirection(Direction.DOWN);

        for (let i = 0; i < Parameters.LENGTH_Y + 10; i++) {
            gameTwo.players.get(users[0].id)?.update(i, 1);

        }
        expect(gameTwo.players.get(users[0].id)?.posY).toEqual(Parameters.LENGTH_Y);
    });

    it('should stop at the top of the screen', async () => {
        gameTwo.players.get(users[0].id)?.setDirection(Direction.UP);

        for (let i = 0; i < 200; i++) {
            gameTwo.players.get(users[0].id)?.update(i, 1);

        }
        expect(gameTwo.players.get(users[0].id)?.posY).toEqual(0);
    });

    it('should stop at the left edge of the screen', async () => {
        gameTwo.players.get(users[0].id)?.setDirection(Direction.LEFT);

        for (let i = 0; i < 200; i++) {
            gameTwo.players.get(users[0].id)?.update(i, 1);

        }
        expect(gameTwo.players.get(users[0].id)?.posX).toEqual(0);
    });
    it('should stop at the right edge of the screen', async () => {
        gameTwo.players.get(users[0].id)?.setDirection(Direction.RIGHT);

        for (let i = 0; i < Parameters.LENGTH_X + 10; i++) {
            gameTwo.players.get(users[0].id)?.update(i, 1);

        }
        expect(gameTwo.players.get(users[0].id)?.posX).toEqual(Parameters.LENGTH_X);
    });

    it('should set the direction of the player on move message', async () => {
        const direction = Direction.DOWN;
        const message = {
            type: GameTwoMessageTypes.MOVE,
            roomId: roomId,
            direction: 'S',
            userId: users[0].id
        }
        gameTwo.receiveInput(message);

        expect(gameTwo.players.get(users[0].id)?.direction).toEqual(direction);
    });

    it('should not set the direction of the player if not counting phase', async () => {
        const direction = Direction.DOWN;
        const message = {
            type: GameTwoMessageTypes.MOVE,
            roomId: roomId,
            direction: 'S',
            userId: users[0].id
        }
        jest.useFakeTimers();
        jest.advanceTimersByTime(Parameters.PHASE_TIMES[Phases.COUNTING]);
        gameTwo.receiveInput(message);

        expect(gameTwo.players.get(users[0].id)?.direction).not.toEqual(direction);
    });
});
