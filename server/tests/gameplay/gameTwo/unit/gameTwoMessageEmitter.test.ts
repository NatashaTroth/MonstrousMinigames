import 'reflect-metadata';

import { leaderboard, roomId, users } from '../../mockData';
import DI from '../../../../src/di';
import { GameTwo } from '../../../../src/gameplay';
import Room from '../../../../src/classes/room';
import { GameState } from '../../../../src/gameplay/enums';
import { NamespaceAdapter } from '../../../../src/gameplay/gameTwo/interfaces';
import { GameTwoMessageEmitter } from '../../../../src/gameplay/gameTwo/classes/GameTwoMessageEmitter';
import { GameTwoInitialGameState, GAME_TWO_EVENT_MESSAGE__GUESS_HINT, GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE } from '../../../../src/gameplay/gameTwo/interfaces/GameTwoEventMessages';


let gameTwo: GameTwo;
let gameTwoMessageEmitter: GameTwoMessageEmitter;

const controllerSpaceEmit = jest.fn((messageName, message) => {
    /*do nothing*/
});

const screenSpaceEmit = jest.fn((messageName, message) => {
    /*do nothing*/
});

const controllerNamespace: NamespaceAdapter = {
    to: jest.fn(roomId => controllerNamespace),
    emit: controllerSpaceEmit,
};

const screenNamespace: NamespaceAdapter = {
    to: jest.fn(roomId => screenNamespace),
    emit: screenSpaceEmit,
};

const room = new Room('xx');
const gameStateInfoData = {
    roomId,
    gameState: GameState.Created,
    playersState: [],
    sheep: [],
    lengthX: 1800,
    lengthY: 900,
    round: 1,
    phase: 'counting',
    timeLeft: 1000,
    aliveSheepCounts: [],
    brightness: 100
    
};


describe('Can handle message', () => {
    beforeAll(() => {
        gameTwoMessageEmitter = DI.resolve(GameTwoMessageEmitter);
    });

    beforeEach(async () => {
        gameTwo = new GameTwo(roomId, leaderboard);
        gameTwo.createNewGame(users);
    });

    it('should return false for a wrong message type', async () => {
        expect(gameTwoMessageEmitter.canHandle({ type: 'test', roomId: 'xx' }, gameTwo)).toBeFalsy();
    });

    it('should return true for a correct message type', async () => {
        expect(
            gameTwoMessageEmitter.canHandle(
                { type: GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE, roomId: 'xx' },
                gameTwo
            )
        ).toBeTruthy();
    });
});

describe('Handle function send to the screens', () => {
    beforeAll(() => {
        gameTwoMessageEmitter = DI.resolve(GameTwoMessageEmitter);
    });

    beforeEach(async () => {
        gameTwo = new GameTwo(roomId, leaderboard);
        gameTwo.createNewGame(users);
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE ', () => {
        const message: GameTwoInitialGameState = {
            type: GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
            roomId,
            data: gameStateInfoData,
        };

        gameTwoMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceEmit).not.toHaveBeenCalled();
    });
});

