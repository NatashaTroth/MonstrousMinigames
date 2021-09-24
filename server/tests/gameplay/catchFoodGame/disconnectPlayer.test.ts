import 'reflect-metadata';
import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import DI from '../../../src/di';
import { CatchFoodGame } from '../../../src/gameplay';
import { PlayerRank } from '../../../src/gameplay/catchFood/interfaces';
// ..
import { GameState } from '../../../src/gameplay/enums';
import { GlobalEventMessage, GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED } from '../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId, users } from '../mockData';
import {
    clearTimersAndIntervals, completeNextObstacle, finishPlayer, startAndFinishGameDifferentTimes,
    startGameAndAdvanceCountdown
} from './gameHelperFunctions';

// const TRACK_LENGTH = 500;

let catchFoodGame: CatchFoodGame;
let gameEventEmitter: GameEventEmitter;

describe('Disconnect Player tests', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });

    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('disconnectPlayer should initialise player isActive as true', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        expect(catchFoodGame.players.get('1')?.isActive).toBeTruthy();
    });

    it('disconnectPlayer should set player isActive to false', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        expect(catchFoodGame.players.get('1')?.isActive).toBeFalsy();
    });

    it('cannot disconnect player when game has stopped', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGameUserClosed();
        try {
            catchFoodGame.disconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.players.get('1')?.isActive).toBeTruthy();
    });

    it('cannot disconnect player when game has finished', async () => {
        await startAndFinishGameDifferentTimes(catchFoodGame);
        try {
            catchFoodGame.disconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.players.get('1')?.isActive).toBeTruthy();
    });

    it('cannot run forward when disconnected', async () => {
        const SPEED = 50;
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame['runForward']('1', SPEED);
        catchFoodGame.disconnectPlayer('1');
        try {
            catchFoodGame['runForward']('1');
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.players.get('1')?.positionX).toBe(catchFoodGame.initialPlayerPositionX + SPEED);
    });

    it('cannot complete an obstacle when disconnected', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const obstaclesLength = catchFoodGame.players.get('1')!.obstacles.length;
        completeNextObstacle(catchFoodGame, '1');
        catchFoodGame.disconnectPlayer('1');

        try {
            catchFoodGame['playerHasCompletedObstacle']('1', catchFoodGame.players.get('1')!.obstacles[0].id);
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.players.get('1')!.obstacles.length).toBe(obstaclesLength - 1);
    });

    it('should emit isActive is false when a player was disconnected and the game has finished', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
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
        catchFoodGame.disconnectPlayer('3');
        catchFoodGame.disconnectPlayer('4');
        finishPlayer(catchFoodGame, '1');
        finishPlayer(catchFoodGame, '2');

        expect(eventData.playerRanks[0].isActive).toBeTruthy();
        expect(eventData.playerRanks[1].isActive).toBeTruthy();
        expect(eventData.playerRanks[2].isActive).toBeFalsy();
        expect(eventData.playerRanks[3].isActive).toBeFalsy();
    });

    it('should have the correct ranks for a player was disconnected and the game has finished (disconnected players should share the last place)', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
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
        catchFoodGame.disconnectPlayer('3');
        catchFoodGame.disconnectPlayer('4');
        Date.now = jest.fn(() => dateNow + 15000);

        finishPlayer(catchFoodGame, '1');
        Date.now = jest.fn(() => dateNow + 20000);
        finishPlayer(catchFoodGame, '2');

        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(2);
        expect(eventData.playerRanks[2].rank).toBe(3);
        expect(eventData.playerRanks[3].rank).toBe(3);
    });

    it('should stop the game when all players have disconnected', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        users.forEach(user => catchFoodGame.disconnectPlayer(user.id));
        expect(catchFoodGame.gameState).toBe(GameState.Stopped);
    });
});
