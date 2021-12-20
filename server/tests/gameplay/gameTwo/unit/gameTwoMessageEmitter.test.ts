import 'reflect-metadata';

import { leaderboard, roomId, users } from '../../mockData';
import DI from '../../../../src/di';
import { GameTwo } from '../../../../src/gameplay';
import Room from '../../../../src/classes/room';
import { GameState } from '../../../../src/gameplay/enums';
import { NamespaceAdapter, PlayerRank } from '../../../../src/gameplay/gameTwo/interfaces';
import { GameTwoMessageEmitter } from '../../../../src/gameplay/gameTwo/classes/GameTwoMessageEmitter';
import { GameTwoGuessHint, GameTwoInitialGameState, GameTwoPhaseHasChanged, GameTwoPlayerRanks, GAME_TWO_EVENT_MESSAGE__GUESS_HINT, GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE, GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED, GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS } from '../../../../src/gameplay/gameTwo/interfaces/GameTwoEventMessages';


let gameTwo: GameTwo;
let gameTwoMessageEmitter: GameTwoMessageEmitter;

const controllerSpaceEmit = jest.fn((messageName, message) => {
    /*do nothing*/
});

const screenSpaceEmit = jest.fn((messageName, message) => {
    /*do nothing*/
});

const controllerSpaceTo = jest.fn(socketId => {
    return controllerNamespace;
});

const controllerNamespace: NamespaceAdapter = {
    to: controllerSpaceTo,
    emit: controllerSpaceEmit,
};

const screenNamespace: NamespaceAdapter = {
    to: jest.fn(roomId => screenNamespace),
    emit: screenSpaceEmit,
};


const room = new Room('roomSocketId');
users.forEach(user => {
    room.addUser(user);
});

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

const playerRanks: PlayerRank[] = [
    {
        id: users[0].id,
        name: users[0].name,
        isActive: users[0].active,
        rank: 1,
        points: 10,
        previousRank: 1
    },
    {
        id: users[1].id,
        name: users[1].name,
        isActive: users[1].active,
        rank: 2,
        points: 9,
        previousRank: 2
    },
    {
        id: users[2].id,
        name: users[2].name,
        isActive: users[2].active,
        points: 8,
        rank: 3,
        previousRank: 3
    },
    {
        id: users[2].id,
        name: users[2].name,
        isActive: users[2].active,
        rank: 4,
        points: 7,
        previousRank: 4
    }
];


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

describe('Handle function send to screens', () => {
    beforeAll(() => {
        gameTwoMessageEmitter = DI.resolve(GameTwoMessageEmitter);
    });

    beforeEach(async () => {
        gameTwo = new GameTwo(roomId, leaderboard);
        gameTwo.createNewGame(users);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });


    it(`should emit ${GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE} for screens`, () => {
        const message: GameTwoInitialGameState = {
            type: GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
            roomId,
            data: gameStateInfoData,
        };

        gameTwoMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceEmit).not.toHaveBeenCalled();
    });

    it(`should emit ${GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS} for screens`, () => {
        const message: GameTwoPlayerRanks = {
            type: GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS,
            roomId,
            playerRanks: playerRanks,
        };

        gameTwoMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceEmit).not.toHaveBeenCalled();
    });

    it(`should emit ${GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED} for all`, () => {
        const message: GameTwoPhaseHasChanged = {
            type: GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED,
            roomId,
            round: 1,
            phase: 'guessing'
        };

        gameTwoMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it(`should emit ${GAME_TWO_EVENT_MESSAGE__GUESS_HINT} for a single controller`, () => {
        const message: GameTwoGuessHint = {
            type: GAME_TWO_EVENT_MESSAGE__GUESS_HINT,
            roomId,
            userId: users[0].id,
            hint: 'too low'
        };

        gameTwoMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).not.toHaveBeenCalled();
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceTo).toHaveBeenCalledWith(room.users[0].socketId);

    });

});