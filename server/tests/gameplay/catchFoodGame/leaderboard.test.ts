import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { GameType } from '../../../src/gameplay/leaderboard/enums/GameType';
import Leaderboard from '../../../src/gameplay/leaderboard/Leaderboard';
import { roomId } from '../mockData';
import { startAndFinishGame } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;

describe('Leaderboard tests for Catch Food Game', () => {
    let leaderboard: Leaderboard;
    let gameEventEmitter: CatchFoodGameEventEmitter;

    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        leaderboard = new Leaderboard(roomId);
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('should call addGameToHistory on leaderboard', async () => {
        const addGameToHistorySpy = jest.spyOn(Leaderboard.prototype as any, 'addGameToHistory');
        startAndFinishGame(catchFoodGame);
        expect(addGameToHistorySpy).toHaveBeenCalledTimes(1);
    });

    it('should save the correct game type to leaderboard game history', async () => {
        startAndFinishGame(catchFoodGame);

        expect(leaderboard.gameHistory[0].game).toBe(GameType.CATCH_FOOD_GAME);
    });

    it('should save the game to leaderboard game history', async () => {
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

        startAndFinishGame(catchFoodGame);

        expect(leaderboard.gameHistory[0].playerRanks).toMatchObject(eventData.playerRanks);
    });
});
