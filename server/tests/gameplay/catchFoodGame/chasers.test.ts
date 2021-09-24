import 'reflect-metadata';
import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import DI from '../../../src/di';
import { CatchFoodGame } from '../../../src/gameplay';
import { PlayerRank } from '../../../src/gameplay/catchFood/interfaces';
import { CatchFoodGameEventMessage, CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD } from '../../../src/gameplay/catchFood/interfaces/CatchFoodGameEventMessages';
import { GameState } from '../../../src/gameplay/enums';
import { GlobalEventMessage, GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED } from '../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId } from '../mockData';
import {
    advanceCountdown, clearTimersAndIntervals, getToCreatedGameState, releaseThreadN,
    startGameAndAdvanceCountdown
} from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
const dateNow = 1618665766156;
let chasersStartPosX: number;
let gameEventEmitter: GameEventEmitter;

describe('Chasers', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        catchFoodGame.chasersPositionX = 50;
        jest.useFakeTimers();
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        chasersStartPosX = catchFoodGame.chasersPositionX;
    });
    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it.skip('starts chasers at initial positionX', async () => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        catchFoodGame.chasersPositionX = 50;
        getToCreatedGameState(catchFoodGame);
        expect(catchFoodGame.chasersPositionX).toBe(chasersStartPosX);
    });

    it.skip('moves the chasers after timeWhenChasersAppear', async () => {
        advanceCountdown(500);
        await releaseThreadN(3);
        expect(catchFoodGame.chasersPositionX).toBeGreaterThan(chasersStartPosX);
    });

    it.skip('sets player to dead when on the same pos as a chaser', async () => {
        catchFoodGame['runForward']('1', chasersStartPosX);
        jest.advanceTimersByTime(1000);
        expect(catchFoodGame.players.get('1')?.dead).toBeTruthy();
    });

    it.skip('sets player to dead when the chaser has passed the player', async () => {
        catchFoodGame['runForward']('1', chasersStartPosX - 1);
        jest.advanceTimersByTime(1000);
        expect(catchFoodGame.players.get('1')?.dead).toBeTruthy();
    });

    it.skip('have the last rank when first to be caught', async () => {
        let eventData = {
            roomId: '',
            userId: '',
            rank: 0,
        };
        const userId = '1';
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: CatchFoodGameEventMessage) => {
            if (message.type === CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD) {
                eventData = message as any;
            }
        });

        catchFoodGame['runForward'](userId, chasersStartPosX + 20);

        //make sure the other players do not get caught
        catchFoodGame.players.get('2')!.positionX = chasersStartPosX + 2000;
        catchFoodGame.players.get('3')!.positionX = chasersStartPosX + 2000;
        catchFoodGame.players.get('4')!.positionX = chasersStartPosX + 2000;

        // should catch the other three players

        jest.advanceTimersByTime(2000); //move 1 every 100ms -> 2000/100 = 20. move 20 to get to player
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            userId: userId,
            rank: 4,
        });
    });

    it.skip('should test that all players have rank 1 when all caught at the same time', async () => {
        let eventData = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [] as PlayerRank[],
        };
        const userId = '1';
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message.data as any;
            }
        });

        //finish game
        for (let i = 1; i <= catchFoodGame.players.size; i++) {
            catchFoodGame.players.get(i.toString())!.obstacles = [];
        }
        // should catch the other three players

        catchFoodGame['runForward'](userId, chasersStartPosX + 20);

        //make sure the other players do not get caught
        catchFoodGame['runForward']('2', chasersStartPosX + 20);
        catchFoodGame['runForward']('3', chasersStartPosX + 20);
        catchFoodGame['runForward']('4', chasersStartPosX + 20);

        jest.advanceTimersByTime(2000); //move 1 every 100ms -> 2000/100 = 20. move 20 to get to player
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(1);
        expect(eventData.playerRanks[2].rank).toBe(1);
        expect(eventData.playerRanks[3].rank).toBe(1);
    });

    it.skip('should test that all players have the correct ranks when 2 are caught', async () => {
        let eventData = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [] as PlayerRank[],
        };
        const userId = '1';
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message.data as any;
            }
        });

        //finish game
        for (let i = 1; i <= catchFoodGame.players.size; i++) {
            catchFoodGame.players.get(i.toString())!.obstacles = [];
        }
        // should catch the other three players

        catchFoodGame['runForward'](userId, chasersStartPosX + 20); //should be 4th (caught first)

        //make sure the other players do not get caught
        catchFoodGame['runForward']('2', chasersStartPosX + 30); //should be 3rd (caught second)

        //should not be caught
        catchFoodGame.players.get('3')!.positionX = chasersStartPosX + 2000;
        catchFoodGame.players.get('4')!.positionX = chasersStartPosX + 2000;

        Date.now = jest.fn(() => dateNow + 2000);
        jest.advanceTimersByTime(2000); //to catch the first 2 players

        Date.now = jest.fn(() => dateNow + 3000);
        jest.advanceTimersByTime(1000); //to catch the first 2 players

        //last 2 players should finish naturally
        Date.now = jest.fn(() => dateNow + 4000);
        catchFoodGame['runForward']('3', catchFoodGame.trackLength); // should be 1st
        Date.now = jest.fn(() => dateNow + 5000);
        catchFoodGame['runForward']('4', catchFoodGame.trackLength); //should be 2nd

        expect(eventData.playerRanks[0].rank).toBe(4);
        expect(eventData.playerRanks[1].rank).toBe(3);
        expect(eventData.playerRanks[2].rank).toBe(1);
        expect(eventData.playerRanks[3].rank).toBe(2);
    });

    it.skip('should test that players have the correct ranks, when player finishes before someone is caught ', async () => {
        let eventData = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [] as PlayerRank[],
        };
        const userId = '1';
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message.data as any;
            }
        });

        //finish game
        for (let i = 1; i <= catchFoodGame.players.size; i++) {
            catchFoodGame.players.get(i.toString())!.obstacles = [];
        }
        // should catch the other three players

        catchFoodGame['runForward'](userId, chasersStartPosX + 20); //should be 4th (caught first)

        //make sure the other players do not get caught
        catchFoodGame['runForward']('2', chasersStartPosX + 30); //should be 3rd (caught second)

        //should not be caught
        catchFoodGame.players.get('3')!.positionX = chasersStartPosX + 2000;
        catchFoodGame.players.get('4')!.positionX = chasersStartPosX + 2000;

        // should finish naturally
        Date.now = jest.fn(() => dateNow + 2000);
        catchFoodGame['runForward']('3', catchFoodGame.trackLength); // should be 1st
        Date.now = jest.fn(() => dateNow + 3000);
        catchFoodGame['runForward']('4', catchFoodGame.trackLength); //should be 2nd

        //are caught
        Date.now = jest.fn(() => dateNow + 4000);
        jest.advanceTimersByTime(2000); //to catch the first 2 players
        Date.now = jest.fn(() => dateNow + 5000);
        jest.advanceTimersByTime(1000); //to catch the first 2 players

        expect(eventData.playerRanks[0].rank).toBe(4);
        expect(eventData.playerRanks[1].rank).toBe(3);
        expect(eventData.playerRanks[2].rank).toBe(1);
        expect(eventData.playerRanks[3].rank).toBe(2);
    });

    it.skip('should test that the game stops when only one player was not caught', async () => {
        let event = false;
        const userId = '1';
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                event = true;
            }
        });

        //finish game
        for (let i = 1; i <= catchFoodGame.players.size; i++) {
            catchFoodGame.players.get(i.toString())!.obstacles = [];
        }
        // should catch the other three players

        catchFoodGame['runForward'](userId, chasersStartPosX + 20);
        catchFoodGame['runForward']('2', chasersStartPosX + 20);
        catchFoodGame['runForward']('3', chasersStartPosX + 20);

        // one last player - should automatically finish when the others are caught
        catchFoodGame.players.get('4')!.positionX = chasersStartPosX + 2000;

        //are caught
        Date.now = jest.fn(() => dateNow + 4000);
        jest.advanceTimersByTime(2000); //to catch the first 3 players

        expect(catchFoodGame.gameState).toBe(GameState.Finished);
        expect(event).toBeTruthy();
    });
});
