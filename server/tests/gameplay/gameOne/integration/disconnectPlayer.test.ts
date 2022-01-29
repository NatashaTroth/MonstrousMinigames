import 'reflect-metadata';

import { container } from 'tsyringe';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { PlayerRank } from '../../../../src/gameplay/gameOne/interfaces';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId } from '../../mockData';
import {
    advanceCountdown, clearTimersAndIntervals, finishPlayer, startGameAndAdvanceCountdown
} from '../gameOneHelperFunctions';
import { playerHasCompletedObstacleMessage, runForwardMessage } from '../gameOneMockData';

// const TRACK_LENGTH = 500;

let gameOne: GameOne;
let gameEventEmitter: GameEventEmitter;
const InitialGameParameters = getInitialParams();

describe('Disconnect Player tests', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    afterAll(() => {
        container.resolve(GameEventEmitter).cleanUpListeners();
    });

    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
        DI.clearInstances();
    });

    it('cannot run forward when disconnected', async () => {
        const userId = '1';
        startGameAndAdvanceCountdown(gameOne);
        gameOne.receiveInput({ ...runForwardMessage, userId });
        gameOne.disconnectPlayer('1');
        gameOne.receiveInput({ ...runForwardMessage, userId });

        expect(gameOne.players.get('1')?.positionX).toBe(gameOne.initialPlayerPositionX + InitialGameParameters.SPEED);
    });

    it('cannot complete an obstacle when disconnected', () => {
        startGameAndAdvanceCountdown(gameOne);
        const obstaclesLength = gameOne.players.get('1')!.obstacles.length;
        gameOne.disconnectPlayer('1');

        gameOne.receiveInput(playerHasCompletedObstacleMessage);
        expect(gameOne.players.get('1')!.obstacles.length).toBe(obstaclesLength);
    });

    it('should emit isActive is false when a player was disconnected and the game has finished', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(gameOne);
        let eventData = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [] as PlayerRank[],
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message.data as any;
            }
        });
        // finish game
        Date.now = jest.fn(() => dateNow + 10000);
        gameOne.disconnectPlayer('3');
        gameOne.disconnectPlayer('4');
        finishPlayer(gameOne, '1');
        finishPlayer(gameOne, '2');
        advanceCountdown(gameOne, 10); //call update to check if game has finished and to handle game finished
        expect(eventData.playerRanks[0].isActive).toBeTruthy();
        expect(eventData.playerRanks[1].isActive).toBeTruthy();
        expect(eventData.playerRanks[2].isActive).toBeFalsy();
        expect(eventData.playerRanks[3].isActive).toBeFalsy();
    });

    it('should have the correct ranks for a player was disconnected and the game has finished (disconnected players should share the last place)', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(gameOne);
        let eventData = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [] as PlayerRank[],
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message.data as any;
            }
        });
        // finish game
        Date.now = jest.fn(() => dateNow + 10000);
        gameOne.disconnectPlayer('3');
        gameOne.disconnectPlayer('4');
        Date.now = jest.fn(() => dateNow + 15000);

        finishPlayer(gameOne, '1');
        Date.now = jest.fn(() => dateNow + 20000);
        finishPlayer(gameOne, '2');
        advanceCountdown(gameOne, 10); //call update to check if game has finished and to handle game finished
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(2);
        expect(eventData.playerRanks[2].rank).toBe(3);
        expect(eventData.playerRanks[3].rank).toBe(3);
    });
});
