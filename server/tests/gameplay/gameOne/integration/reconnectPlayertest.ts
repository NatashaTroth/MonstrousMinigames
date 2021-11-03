import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { PlayerRank } from '../../../../src/gameplay/gameOne/interfaces';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId } from '../../mockData';
import {
    clearTimersAndIntervals, completeNextObstacle, finishPlayer, startGameAndAdvanceCountdown
} from './gameOneHelperFunctions';

// const TRACK_LENGTH = 500;

let gameOne: GameOne;
let gameEventEmitter: GameEventEmitter;

describe('Reconnect Player tests', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        // gameEventEmitter = GameOneEventEmitter.getInstance();
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('reconnectPlayer should set player isActive to true', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('1');
        gameOne.reconnectPlayer('1');
        expect(gameOne.players.get('1')!.isActive).toBeTruthy();
    });

    it('reconnectPlayer should not change anything if player was not disconnected (no error should be thrown)', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.reconnectPlayer('1');
        expect(gameOne.players.get('1')!.isActive).toBeTruthy();
    });

    it('cannot reconnect player when game has stopped', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('1');
        gameOne.stopGameUserClosed();
        try {
            gameOne.reconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(gameOne.players.get('1')!.isActive).toBeFalsy();
    });

    it('cannot reconnect player when game has finished', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('1');

        finishPlayer(gameOne, '2');
        finishPlayer(gameOne, '3');
        finishPlayer(gameOne, '4');
        try {
            gameOne.reconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(gameOne.players.get('1')!.isActive).toBeFalsy();
    });

    it('can run forward after being reconnected', async () => {
        const SPEED = 50;
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('1');
        gameOne.reconnectPlayer('1');
        gameOne['runForward']('1', SPEED);
        expect(gameOne.players.get('1')!.positionX).toBe(gameOne.initialPlayerPositionX + SPEED);
    });

    it('can complete an obstacle after being reconnected', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const obstaclesLength = gameOne.players.get('1')!.obstacles.length;
        gameOne.disconnectPlayer('1');
        gameOne.reconnectPlayer('1');
        completeNextObstacle(gameOne, '1');
        expect(gameOne.players.get('1')!.obstacles.length).toBe(obstaclesLength - 1);
    });

    it('should not finish game until reconnected player is finished', async () => {
        startGameAndAdvanceCountdown(gameOne);

        // finish game
        gameOne.disconnectPlayer('3');
        gameOne.disconnectPlayer('4');
        finishPlayer(gameOne, '1');
        gameOne.reconnectPlayer('4');
        finishPlayer(gameOne, '2');

        expect(gameOne.gameState).toBe(GameState.Started);
        finishPlayer(gameOne, '4');
        expect(gameOne.gameState).toBe(GameState.Finished);
    });

    it('should emit isActive is true when a player was reconnected and the game has finished', async () => {
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
        gameOne.reconnectPlayer('4');
        finishPlayer(gameOne, '2');
        finishPlayer(gameOne, '4');

        expect(eventData.playerRanks[0].isActive).toBeTruthy();
        expect(eventData.playerRanks[1].isActive).toBeTruthy();
        expect(eventData.playerRanks[2].isActive).toBeFalsy();
        expect(eventData.playerRanks[3].isActive).toBeTruthy();
    });
});
