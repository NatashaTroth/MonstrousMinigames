import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
// import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
// ..
import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../mockData';
import {
    completeNextObstacle, finishPlayer, startAndFinishGameDifferentTimes,
    startGameAndAdvanceCountdown
} from './gameHelperFunctions';

// const TRACK_LENGTH = 500;

let catchFoodGame: CatchFoodGame;
let gameEventEmitter: CatchFoodGameEventEmitter;

describe('Disconnect Player tests', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        // gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });

    afterEach(async () => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('disconnectPlayer should initialise player isActive as true', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        expect(catchFoodGame.playersState['1'].isActive).toBeTruthy();
    });

    it('disconnectPlayer should set player isActive to false', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        expect(catchFoodGame.playersState['1'].isActive).toBeFalsy();
    });

    it('cannot disconnect player when game has stopped', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGameUserClosed();
        try {
            catchFoodGame.disconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.playersState['1'].isActive).toBeTruthy();
    });

    it('cannot disconnect player when game has finished', async () => {
        startAndFinishGameDifferentTimes(catchFoodGame);
        try {
            catchFoodGame.disconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.playersState['1'].isActive).toBeTruthy();
    });

    it('cannot run forward when disconnected', async () => {
        const SPEED = 50;
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.runForward('1', SPEED);
        catchFoodGame.disconnectPlayer('1');
        try {
            catchFoodGame.runForward('1');
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.playersState['1'].positionX).toBe(SPEED);
    });

    it('cannot complete an obstacle when disconnected', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const obstaclesLength = catchFoodGame.playersState['1'].obstacles.length;
        completeNextObstacle(catchFoodGame, '1');
        catchFoodGame.disconnectPlayer('1');

        try {
            catchFoodGame.playerHasCompletedObstacle('1', catchFoodGame.playersState['1'].obstacles[0].id);
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(obstaclesLength - 1);
    });

    it('should emit isActive is false when a player was disconnected and the game has finished', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        let eventData: GameEvents.GameHasFinished = {
            roomId: '',
            gameState: GameState.Started,
            trackLength: 0,
            numberOfObstacles: 0,
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
        finishPlayer(catchFoodGame, '2');

        expect(eventData.playerRanks[0].isActive).toBeTruthy();
        expect(eventData.playerRanks[1].isActive).toBeTruthy();
        expect(eventData.playerRanks[2].isActive).toBeFalsy();
        expect(eventData.playerRanks[3].isActive).toBeFalsy();
    });

    it('should stop the game when all players have disconnected', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        users.forEach(user => catchFoodGame.disconnectPlayer(user.id));
        expect(catchFoodGame.gameState).toBe(GameState.Stopped);
    });
});
