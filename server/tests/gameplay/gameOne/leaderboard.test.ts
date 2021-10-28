import 'reflect-metadata';

import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import DI from '../../../src/di';
import { GameOne } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/enums';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage
} from '../../../src/gameplay/interfaces/GlobalEventMessages';
import { GameType } from '../../../src/gameplay/leaderboard/enums/GameType';
import Leaderboard from '../../../src/gameplay/leaderboard/Leaderboard';
import { roomId } from '../mockData';
import { clearTimersAndIntervals, startAndFinishGame } from './gameHelperFunctions';

let gameOne: GameOne;

describe('Leaderboard tests for Catch Food Game', () => {
    let leaderboard: Leaderboard;
    let gameEventEmitter: GameEventEmitter;

    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        jest.useFakeTimers();
        leaderboard = new Leaderboard(roomId);
        gameOne = new GameOne(roomId, leaderboard);
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('should call addGameToHistory on leaderboard', async () => {
        const addGameToHistorySpy = jest.spyOn(Leaderboard.prototype as any, 'addGameToHistory');
        startAndFinishGame(gameOne);
        expect(addGameToHistorySpy).toHaveBeenCalledTimes(1);
    });

    it('should save the correct game type to leaderboard game history', async () => {
        startAndFinishGame(gameOne);

        expect(leaderboard.gameHistory[0].game).toBe(GameType.GameOne);
    });

    it('should save the game to leaderboard game history', async () => {
        let eventData = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [],
        };

        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message.data as any;
            }
        });

        startAndFinishGame(gameOne);

        expect(leaderboard.gameHistory[0].playerRanks).toMatchObject(eventData.playerRanks);
    });
});
