import 'reflect-metadata';

import Room from '../../../../src/classes/room';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { ObstacleType } from '../../../../src/gameplay/gameOne/enums';
import {
    GameOneEventMessageEmitter
} from '../../../../src/gameplay/gameOne/GameOneEventMessageEmitter';
import { NamespaceAdapter } from '../../../../src/gameplay/gameOne/interfaces';
import {
    GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
    GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE,
    GAME_ONE_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
    GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED, GAME_ONE_EVENT_MESSAGE__OBSTACLE_SKIPPED,
    GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED,
    GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES,
    GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED, GAME_ONE_EVENT_MESSAGE__PLAYER_IS_DEAD,
    GAME_ONE_EVENT_MESSAGE__PLAYER_IS_STUNNED, GAME_ONE_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
    GAME_ONE_EVENT_MESSAGE__STUNNABLE_PLAYERS, GameOneApproachingSolvableObstacle,
    GameOneApproachingSolvableObstacleOnce, GameOneChasersWerePushed, GameOneInitialGameState,
    GameOneObstacleReachedInfo, GameOneObstacleSkippedInfo,
    GameOnePlayerHasExceededMaxNumberChaserPushes, GameOnePlayerHasFinished, GameOnePlayerIsDead,
    GameOnePlayerStunnedState, GameOnePlayerUnstunnedState, GameOneSolveObstacleInfo,
    GameOneStunnablePlayers
} from '../../../../src/gameplay/gameOne/interfaces/GameOneEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameOne: GameOne;
let gameOneEventMessageEmitter: GameOneEventMessageEmitter;

const controllerSpaceEmit = jest.fn((messageName, message) => {
    /*do nothing*/
});

const screenSpaceEmit = jest.fn((messageName, message) => {
    /*do nothing*/
});

const controllerSpaceTo = jest.fn(socketId => {
    return controllerNamespace;
});

const screenSpaceTo = jest.fn(socketId => {
    return screenNamespace;
});

const controllerNamespace: NamespaceAdapter = {
    to: controllerSpaceTo,
    emit: controllerSpaceEmit,
};

const screenNamespace: NamespaceAdapter = {
    to: screenSpaceTo,
    emit: screenSpaceEmit,
};

const room = new Room('roomSocketId');
users.forEach(user => {
    room.addUser(user);
});

const userId = users[0].id;
const obstacleId = 4;
const obstacleType = ObstacleType.TreeStump;
const distance = 200;
const gameStateInfoData = {
    roomId,
    playersState: [],
    gameState: GameState.Created,
    chasersPositionX: 100,
    cameraPositionX: 150,
};

describe('Can handle function', () => {
    beforeAll(() => {
        gameOneEventMessageEmitter = DI.resolve(GameOneEventMessageEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    it('should return false for a wrong message type', async () => {
        expect(gameOneEventMessageEmitter.canHandle({ type: 'test', roomId: 'xx' }, gameOne)).toBeFalsy();
    });

    it('should return true for a correct message type', async () => {
        expect(
            gameOneEventMessageEmitter.canHandle(
                { type: GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE, roomId: 'xx' },
                gameOne
            )
        ).toBeTruthy();
    });
});

describe('Handle function does not send when not user', () => {
    beforeAll(() => {
        gameOneEventMessageEmitter = DI.resolve(GameOneEventMessageEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should not call emit GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE function', () => {
        const message: GameOneApproachingSolvableObstacle = {
            type: GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
            roomId,
            userId: 'notUserId',
            obstacleId,
            obstacleType,
            distance,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).not.toHaveBeenCalled();
    });

    it('should not call to GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE function', () => {
        const message: GameOneApproachingSolvableObstacle = {
            type: GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
            roomId,
            userId: 'notUserId',
            obstacleId,
            obstacleType,
            distance,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceTo).not.toHaveBeenCalled();
    });
});

describe("Handle function send to single user's controller", () => {
    beforeAll(() => {
        gameOneEventMessageEmitter = DI.resolve(GameOneEventMessageEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE ', () => {
        const message: GameOneApproachingSolvableObstacle = {
            type: GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
            roomId,
            userId,
            obstacleId,
            obstacleType,
            distance,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(screenSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE to single user's (in the message)", () => {
        const message: GameOneApproachingSolvableObstacle = {
            type: GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
            roomId,
            userId,
            obstacleId,
            obstacleType,
            distance,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceTo).toHaveBeenCalledWith(room.users[0].socketId);
        expect(screenSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED ', () => {
        const message: GameOneObstacleReachedInfo = {
            type: GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED,
            roomId,
            userId,
            obstacleId,
            obstacleType,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(screenSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED to single user's (in the message)", () => {
        const message: GameOneObstacleReachedInfo = {
            type: GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED,
            roomId,
            userId,
            obstacleId,
            obstacleType,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceTo).toHaveBeenCalledWith(room.users[0].socketId);
        expect(screenSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__PLAYER_IS_STUNNED ', () => {
        const message: GameOnePlayerStunnedState = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_IS_STUNNED,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(screenSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__PLAYER_IS_STUNNED to single user's (in the message)", () => {
        const message: GameOnePlayerStunnedState = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_IS_STUNNED,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceTo).toHaveBeenCalledWith(room.users[0].socketId);
        expect(screenSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED ', () => {
        const message: GameOnePlayerUnstunnedState = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(screenSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED to single user's (in the message)", () => {
        const message: GameOnePlayerUnstunnedState = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceTo).toHaveBeenCalledWith(room.users[0].socketId);
        expect(screenSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED ', () => {
        const message: GameOnePlayerHasFinished = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
            roomId,
            userId,
            rank: 1,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(screenSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED to single user's (in the message)", () => {
        const message: GameOnePlayerHasFinished = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
            roomId,
            userId,
            rank: 1,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceTo).toHaveBeenCalledWith(room.users[0].socketId);
        expect(screenSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__PLAYER_IS_DEAD ', () => {
        const message: GameOnePlayerIsDead = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_IS_DEAD,
            roomId,
            userId,
            rank: 1,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(screenSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__PLAYER_IS_DEAD to single user's (in the message)", () => {
        const message: GameOnePlayerIsDead = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_IS_DEAD,
            roomId,
            userId,
            rank: 1,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceTo).toHaveBeenCalledWith(room.users[0].socketId);
        expect(screenSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES ', () => {
        const message: GameOnePlayerHasExceededMaxNumberChaserPushes = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(screenSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES to single user's (in the message)", () => {
        const message: GameOnePlayerHasExceededMaxNumberChaserPushes = {
            type: GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceTo).toHaveBeenCalledWith(room.users[0].socketId);
        expect(screenSpaceTo).not.toHaveBeenCalled();
    });
});

describe("Handle function send to room's controllers", () => {
    beforeAll(() => {
        gameOneEventMessageEmitter = DI.resolve(GameOneEventMessageEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__STUNNABLE_PLAYERS ', () => {
        const message: GameOneStunnablePlayers = {
            type: GAME_ONE_EVENT_MESSAGE__STUNNABLE_PLAYERS,
            roomId,
            stunnablePlayers: [],
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(screenSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__STUNNABLE_PLAYERS to room's controllers", () => {
        const message: GameOneStunnablePlayers = {
            type: GAME_ONE_EVENT_MESSAGE__STUNNABLE_PLAYERS,
            roomId,
            stunnablePlayers: [],
        };

        gameOneEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceTo).toHaveBeenCalledWith(room.id);
        expect(screenSpaceTo).not.toHaveBeenCalled();
    });
});

describe("Handle function send to room's screens", () => {
    beforeAll(() => {
        gameOneEventMessageEmitter = DI.resolve(GameOneEventMessageEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE ', () => {
        const message: GameOneInitialGameState = {
            type: GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
            roomId,
            data: gameStateInfoData,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE to room's screens", () => {
        const message: GameOneInitialGameState = {
            type: GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
            roomId,
            data: gameStateInfoData,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceTo).toHaveBeenCalledWith(room.id);
        expect(controllerSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE ', () => {
        const message: GameOneApproachingSolvableObstacleOnce = {
            type: GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE,
            roomId,
            userId,
            obstacleId,
            obstacleType,
            distance,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE to room's screens", () => {
        const message: GameOneApproachingSolvableObstacleOnce = {
            type: GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE,
            roomId,
            userId,
            obstacleId,
            obstacleType,
            distance,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceTo).toHaveBeenCalledWith(room.id);
        expect(controllerSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__OBSTACLE_SKIPPED ', () => {
        const message: GameOneObstacleSkippedInfo = {
            type: GAME_ONE_EVENT_MESSAGE__OBSTACLE_SKIPPED,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__OBSTACLE_SKIPPED to room's screens", () => {
        const message: GameOneObstacleSkippedInfo = {
            type: GAME_ONE_EVENT_MESSAGE__OBSTACLE_SKIPPED,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceTo).toHaveBeenCalledWith(room.id);
        expect(controllerSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED ', () => {
        const message: GameOneSolveObstacleInfo = {
            type: GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED to room's screens", () => {
        const message: GameOneSolveObstacleInfo = {
            type: GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED,
            roomId,
            userId,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceTo).toHaveBeenCalledWith(room.id);
        expect(controllerSpaceTo).not.toHaveBeenCalled();
    });

    it('should emit GAME_ONE_EVENT_MESSAGE__CHASERS_WERE_PUSHED ', () => {
        const message: GameOneChasersWerePushed = {
            type: GAME_ONE_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
            roomId,
            amount: 100,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
        expect(controllerSpaceEmit).not.toHaveBeenCalled();
    });

    it("should emit GAME_ONE_EVENT_MESSAGE__CHASERS_WERE_PUSHED to room's screens", () => {
        const message: GameOneChasersWerePushed = {
            type: GAME_ONE_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
            roomId,
            amount: 100,
        };

        gameOneEventMessageEmitter.handle(screenNamespace, screenNamespace, room, message);
        expect(screenSpaceTo).toHaveBeenCalledWith(room.id);
        expect(controllerSpaceTo).not.toHaveBeenCalled();
    });
});
