import 'reflect-metadata';

import { container } from 'tsyringe';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import Chasers from '../../../../src/gameplay/gameOne/classes/Chasers';
import {
    ObstacleType, regularObstacleTypes
} from '../../../../src/gameplay/gameOne/enums/ObstacleType';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import {
    createObstacles
} from '../../../../src/gameplay/gameOne/helperFunctions/initiatePlayerState';
import {
    GameStateInfo, InitialGameStateInfo, Obstacle
} from '../../../../src/gameplay/gameOne/interfaces';
import {
    GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE, GameOneEventMessage
} from '../../../../src/gameplay/gameOne/interfaces/GameOneEventMessages';
import { leaderboard, roomId, trackLength, users } from '../../mockData';

const InitialGameParameters = getInitialParams();
// import {
//     numberOfObstacles, numberOfStones, TRACK_LENGTH, trackLength as InitialGameParameters
// } from '../mockDataGameOne';

let gameOne: GameOne;
const REGULAR_OBSTACLE_TYPE_KEYS = regularObstacleTypes;
let gameStateInfo: GameStateInfo;
let initialGameStateInfo: InitialGameStateInfo;
let gameEventEmitter: GameEventEmitter;
// let gameOnePlayer: GameOnePlayer;
let chasers: Chasers;

describe('Change and verify game state', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    afterAll(() => {
        container.resolve(GameEventEmitter).cleanUpListeners();
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE) {
                initialGameStateInfo = message.data;
            }
        });
        gameOne.createNewGame(users);
        gameStateInfo = gameOne.getGameStateInfo();
        chasers = new Chasers(trackLength, roomId, getInitialParams());
    });

    afterAll(() => {
        gameEventEmitter.removeAllListeners();
    });

    afterEach(() => {
        DI.clearInstances();
    });

    it('initiates chasersPositionX with correct value', async () => {
        expect(gameStateInfo.chasersPositionX).toBe(InitialGameParameters.CHASERS_POSITION_X);
    });

    it('initiates cameraPositionX with correct value', async () => {
        expect(gameStateInfo.cameraPositionX).toBe(InitialGameParameters.CAMERA_POSITION_X);
    });

    it('initiates trackLength with correct length', async () => {
        expect(initialGameStateInfo.trackLength).toBe(InitialGameParameters.TRACK_LENGTH);
    });

    it('throws an error if the track length is too short', async () => {
        expect(() => createObstacles([{ type: ObstacleType.Spider }], 4, 3, 1)).toThrowError();
    });

    it('initiates correct number of obstacles', async () => {
        expect(gameOne.numberOfObstacles).toBe(InitialGameParameters.NUMBER_OBSTACLES);
    });

    it('initiates maxNumberOfChaserPushes with the correct value', async () => {
        expect(gameOne.players.get('1')!.maxNumberOfChaserPushes).toBe(InitialGameParameters.MAX_NUMBER_CHASER_PUSHES);
    });

    it('initiates chaserPushAmount with the correct value', async () => {
        expect(chasers.chaserPushAmount).toBe(InitialGameParameters.CHASER_PUSH_AMOUNT);
    });

    it('initiates speed with the correct value', async () => {
        expect(gameOne.speed).toBe(InitialGameParameters.SPEED);
    });

    it('initiates countdownTime with the correct value', async () => {
        expect(gameOne.countdownTime).toBe(InitialGameParameters.COUNTDOWN_TIME);
    });

    it('initiates cameraSpeed with the correct value', async () => {
        expect(gameOne.cameraSpeed).toBe(InitialGameParameters.CAMERA_SPEED);
    });

    it('initiates chasersSpeed with the correct value', async () => {
        expect(chasers.chasersSpeed).toBe(InitialGameParameters.CHASERS_SPEED);
    });

    it('initiates stunnedTime with the correct value', async () => {
        expect(gameOne.players.get('1')!.stunnedTime).toBe(InitialGameParameters.STUNNED_TIME);
    });

    // it('initiates approachSolvableObstacleDistance with the correct value', async () => {
    //     expect(gameOnePlayer.approachSolvableObstacleDistance).toBe(InitialGameParameters.APPROACH_SOLVABLE_OBSTACLE_DISTANCE);
    // });

    it('initiates player positionX with initial position', async () => {
        expect(gameOne.players.get('1')!.positionX).toBe(gameOne.initialPlayerPositionX);
    });

    it('initiates player not atObstacle as false', async () => {
        expect(gameOne.players.get('1')!.atObstacle).toBeFalsy();
    });

    it('initiates player as not dead', async () => {
        expect(gameOne.players.get('1')!.dead).toBeFalsy();
    });

    it('initiates player as not stunned', async () => {
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('initiates player with stones not overlapping with other obstacles', () => {
        const obstacles = gameOne.players.get('1')!.obstacles;

        for (let i = 0; i < obstacles.length; i++) {
            if (obstacles[i].type !== ObstacleType.Stone) {
                continue;
            }
            if (i > 0) {
                expect(obstacles[i].positionX).toBeGreaterThan(obstacles[i - 1].positionX + 100);
            }
            if (i < obstacles.length - 1) {
                expect(obstacles[i].positionX).toBeLessThan(obstacles[i + 1].positionX - 100);
            }
        }
    });

    it("initiates all players' stones at the same position", () => {
        const playersWithStonesOnly = Array.from(gameOne.players.values()).map(player => {
            player.obstacles = player.obstacles.filter(obstacle => obstacle.type === ObstacleType.Stone);
            return player;
        });

        for (let i = 1; i < playersWithStonesOnly.length; i++) {
            expect(playersWithStonesOnly[i].obstacles.length).toBe(playersWithStonesOnly[i - 1].obstacles.length);
            for (let j = 0; j < playersWithStonesOnly[i].obstacles.length; j++) {
                expect(playersWithStonesOnly[i].obstacles[j].positionX).toBe(
                    playersWithStonesOnly[i - 1].obstacles[j].positionX
                );
            }
        }
    });

    function getObstacleRange(gameOne: GameOne): number {
        return (
            Math.floor((gameOne.trackLength - gameOne.initialPlayerPositionX) / (gameOne.numberOfObstacles + 1)) - 100
        );
    }

    it('initiates the first obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(gameOne);
        const obstacles: Array<Obstacle> = gameOne.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(obstacles[0].positionX).toBeGreaterThanOrEqual(gameOne.initialPlayerPositionX + obstacleRange);
        expect(obstacles[0].positionX).toBeLessThanOrEqual(gameOne.initialPlayerPositionX + obstacleRange * 2);
    });

    it('initiates the second obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(gameOne);
        const obstacles: Array<Obstacle> = gameOne.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(obstacles[1].positionX).toBeGreaterThanOrEqual(gameOne.initialPlayerPositionX + obstacleRange * 2);
        expect(obstacles[1].positionX).toBeLessThanOrEqual(gameOne.initialPlayerPositionX + obstacleRange * 3);
    });

    it('initiates the third obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(gameOne);

        const obstacles: Array<Obstacle> = gameOne.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(obstacles[2].positionX).toBeGreaterThanOrEqual(gameOne.initialPlayerPositionX + obstacleRange * 3);
        expect(obstacles[2].positionX).toBeLessThanOrEqual(gameOne.initialPlayerPositionX + obstacleRange * 4);
    });

    it('initiates the fourth obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(gameOne);

        const obstacles: Array<Obstacle> = gameOne.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(obstacles[3].positionX).toBeGreaterThanOrEqual(gameOne.initialPlayerPositionX + obstacleRange * 4);
        expect(obstacles[3].positionX).toBeLessThanOrEqual(gameOne.initialPlayerPositionX + obstacleRange * 5);
    });

    it('initiates the first obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = gameOne.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(REGULAR_OBSTACLE_TYPE_KEYS).toContain(obstacles[0].type);
    });

    it('initiates the second obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = gameOne.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(REGULAR_OBSTACLE_TYPE_KEYS).toContain(obstacles[1].type);
    });

    it('initiates the third obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = gameOne.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(REGULAR_OBSTACLE_TYPE_KEYS).toContain(obstacles[2].type);
    });

    it('initiates the fourth obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = gameOne.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(REGULAR_OBSTACLE_TYPE_KEYS).toContain(obstacles[3].type);
    });
});
