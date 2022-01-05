import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import Chasers from '../../../../src/gameplay/gameOne/classes/Chasers';
import InitialParameters from '../../../../src/gameplay/gameOne/constants/InitialParameters';
import { leaderboard, roomId, trackLength, users } from '../../mockData';
import {
    advanceCountdown, clearTimersAndIntervals, startGameAndAdvanceCountdown
} from '../gameOneHelperFunctions';
import { pushChasersMessage } from '../gameOneMockData';

let chasers: Chasers;

describe('Chasers', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        chasers = new Chasers(trackLength, roomId);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('starts chasers at initial positionX', async () => {
        expect(chasers.getPosition()).toBe(InitialParameters.CHASERS_POSITION_X);
    });

    it('moves the chasers after time passes', async () => {
        chasers.update(100, 100);
        expect(chasers.getPosition()).toBeGreaterThan(InitialParameters.CHASERS_POSITION_X);
    });

    it('should change chaser speed to push speed when pushChasers pushed', async () => {
        chasers.push();
        expect(chasers.chasersSpeed).toBe(InitialParameters.CHASERS_PUSH_SPEED);
    });

    it('should return chaser speed to normal when pushChasers time has run out', async () => {
        chasers.push();
        jest.runAllTimers();
        expect(chasers.chasersSpeed).toBe(InitialParameters.CHASERS_SPEED);
    });
});

describe('Push Chasers', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.gameState = GameState.Started;
        gameOne.players.get(users[0].id)!.finished = true;
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
        jest.clearAllMocks();
    });

    it('should not push chasers when pushing user has not finished', async () => {
        const initialChasersPositionX = InitialParameters.CHASERS_POSITION_X;
        gameOne.receiveInput({ ...pushChasersMessage, userId: users[1].id });
        expect(gameOne.chasers?.getPosition()).toBe(initialChasersPositionX);
    });

    it('should not push chasers when pushing user has not finished', async () => {
        const initialChasersPositionX = InitialParameters.CHASERS_POSITION_X;
        gameOne.receiveInput(pushChasersMessage);
        expect(gameOne.chasers?.getPosition()).toBeGreaterThan(initialChasersPositionX);
    });

    it('should push chasers forward chasers push amount', async () => {
        const initialChasersPositionX = InitialParameters.CHASERS_POSITION_X;
        gameOne.receiveInput(pushChasersMessage);
        expect(gameOne.chasers?.getPosition()).toBe(initialChasersPositionX + InitialParameters.CHASER_PUSH_AMOUNT);
    });

    it('should check if chaser has passed a player when pushed', async () => {
        gameOne.players.get(users[1].id)!.positionX = InitialParameters.CHASERS_POSITION_X;
        gameOne.receiveInput(pushChasersMessage);
        expect(gameOne.players.get(users[1].id)!.dead).toBeTruthy();
    });

    it('should increase pushing users chaserPushesUsed number', async () => {
        const initialChaserPushesUsed = gameOne.players.get(users[0].id)!.chaserPushesUsed;
        gameOne.receiveInput(pushChasersMessage);
        expect(gameOne.players.get(users[0].id)!.chaserPushesUsed).toBe(initialChaserPushesUsed + 1);
    });

    it('should not push chasers when pushing user has exceeded max number of pushes', async () => {
        const initialChasersPositionX = gameOne.chasers?.chasersPositionX;
        gameOne.players.get(users[0].id)!.chaserPushesUsed = InitialParameters.MAX_NUMBER_CHASER_PUSHES;
        gameOne.receiveInput(pushChasersMessage);
        expect(gameOne.chasers?.chasersPositionX).toBe(initialChasersPositionX);
    });
});

let gameOne: GameOne;

describe('Chaser catch player logic in GameOne.ts (combined with player logic)', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        startGameAndAdvanceCountdown(gameOne);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should not catch player when chaser does not overtake them', async () => {
        gameOne.players.get(users[0].id)!.positionX = trackLength;
        advanceCountdown(gameOne, 10);
        expect(gameOne.players.get('1')!.dead).toBeFalsy();
    });

    it('should catch player when chaser overtakes them', async () => {
        gameOne.players.get(users[0].id)!.positionX = 0;
        advanceCountdown(gameOne, 1000);
        expect(gameOne.players.get('1')!.dead).toBeTruthy();
    });

    it('sets player to dead when on the same pos as a chaser', async () => {
        gameOne.players.get(users[0].id)!.positionX = InitialParameters.CHASERS_POSITION_X;
        advanceCountdown(gameOne, 0);
        expect(gameOne.players.get('1')!.dead).toBeTruthy();
    });
});
