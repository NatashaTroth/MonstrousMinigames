import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
// import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
// ..
import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId } from '../mockData';
import {
    clearTimersAndIntervals, completeNextObstacle, finishPlayer, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

// const TRACK_LENGTH = 500;

let catchFoodGame: CatchFoodGame;
let gameEventEmitter: CatchFoodGameEventEmitter;

describe('Reconnect Player tests', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        // gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
    });

    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('reconnectPlayer should set player isActive to true', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        catchFoodGame.reconnectPlayer('1');
        expect(catchFoodGame.players.get('1')!.isActive).toBeTruthy();
    });

    it('reconnectPlayer should not change anything if player was not disconnected (no error should be thrown)', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.reconnectPlayer('1');
        expect(catchFoodGame.players.get('1')!.isActive).toBeTruthy();
    });

    it('cannot reconnect player when game has stopped', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        catchFoodGame.stopGameUserClosed();
        try {
            catchFoodGame.reconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.players.get('1')!.isActive).toBeFalsy();
    });

    it('cannot reconnect player when game has finished', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');

        finishPlayer(catchFoodGame, '2');
        finishPlayer(catchFoodGame, '3');
        finishPlayer(catchFoodGame, '4');
        try {
            catchFoodGame.reconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.players.get('1')!.isActive).toBeFalsy();
    });

    it('can run forward after being reconnected', async () => {
        const SPEED = 50;
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        catchFoodGame.reconnectPlayer('1');
        catchFoodGame['runForward']('1', SPEED);
        expect(catchFoodGame.players.get('1')!.positionX).toBe(catchFoodGame.initialPlayerPositionX + SPEED);
    });

    it('can complete an obstacle after being reconnected', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const obstaclesLength = catchFoodGame.players.get('1')!.obstacles.length;
        catchFoodGame.disconnectPlayer('1');
        catchFoodGame.reconnectPlayer('1');
        completeNextObstacle(catchFoodGame, '1');
        expect(catchFoodGame.players.get('1')!.obstacles.length).toBe(obstaclesLength - 1);
    });

    it('should not finish game until reconnected player is finished', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);

        // finish game
        catchFoodGame.disconnectPlayer('3');
        catchFoodGame.disconnectPlayer('4');
        finishPlayer(catchFoodGame, '1');
        catchFoodGame.reconnectPlayer('4');
        finishPlayer(catchFoodGame, '2');

        expect(catchFoodGame.gameState).toBe(GameState.Started);
        finishPlayer(catchFoodGame, '4');
        expect(catchFoodGame.gameState).toBe(GameState.Finished);
    });

    it('should emit isActive is true when a player was reconnected and the game has finished', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        let eventData: GameEvents.GameHasFinished = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [],
        };
        gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameEvents.GameHasFinished) => {
            eventData = data;
        });
        // finish game
        Date.now = jest.fn(() => dateNow + 10000);
        catchFoodGame.disconnectPlayer('3');
        catchFoodGame.disconnectPlayer('4');
        finishPlayer(catchFoodGame, '1');
        catchFoodGame.reconnectPlayer('4');
        finishPlayer(catchFoodGame, '2');
        finishPlayer(catchFoodGame, '4');

        expect(eventData.playerRanks[0].isActive).toBeTruthy();
        expect(eventData.playerRanks[1].isActive).toBeTruthy();
        expect(eventData.playerRanks[2].isActive).toBeFalsy();
        expect(eventData.playerRanks[3].isActive).toBeTruthy();
    });
});
