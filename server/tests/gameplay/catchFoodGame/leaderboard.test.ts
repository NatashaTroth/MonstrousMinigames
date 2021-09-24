import 'reflect-metadata';
import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import DI from '../../../src/di';
import { CatchFoodGame } from '../../../src/gameplay';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
import { GameState } from '../../../src/gameplay/enums';
import { GlobalEventMessage, GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED } from '../../../src/gameplay/interfaces/GlobalEventMessages';
import { GameType } from '../../../src/gameplay/leaderboard/enums/GameType';
import Leaderboard from '../../../src/gameplay/leaderboard/Leaderboard';
import { roomId } from '../mockData';
import { clearTimersAndIntervals, startAndFinishGame } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;

describe('Leaderboard tests for Catch Food Game', () => {
    let leaderboard: Leaderboard;
    let gameEventEmitter: GameEventEmitter;

    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        jest.useFakeTimers();
        leaderboard = new Leaderboard(roomId);
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
    });

    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('should call addGameToHistory on leaderboard', async () => {
        const addGameToHistorySpy = jest.spyOn(Leaderboard.prototype as any, 'addGameToHistory');
        startAndFinishGame(catchFoodGame);
        expect(addGameToHistorySpy).toHaveBeenCalledTimes(1);
    });

    it('should save the correct game type to leaderboard game history', async () => {
        startAndFinishGame(catchFoodGame);

        expect(leaderboard.gameHistory[0].game).toBe(GameType.CatchFoodGame);
    });

    it('should save the game to leaderboard game history', async () => {
        let eventData: GameEvents.GameHasFinished = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [],
        };

        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message.data as any;
            }
        });

        startAndFinishGame(catchFoodGame);

        expect(leaderboard.gameHistory[0].playerRanks).toMatchObject(eventData.playerRanks);
    });
});
