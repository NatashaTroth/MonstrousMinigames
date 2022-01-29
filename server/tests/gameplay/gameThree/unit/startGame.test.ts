import 'reflect-metadata';

import { container } from 'tsyringe';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameState } from '../../../../src/gameplay/enums';
import { StageController } from '../../../../src/gameplay/gameThree/classes/StageController';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED, GlobalEventMessage
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { advanceCountdown } from '../../gameHelperFunctions';
import { leaderboard, roomId, users } from '../../mockData';

jest.mock('../../../../src/gameplay/gameThree/classes/StageController');
let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Start', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    afterAll(() => {
        container.resolve(GameEventEmitter).cleanUpListeners();
    });

    beforeEach(() => {
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        gameThree.gameState = GameState.Started;
    });
    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should call start super function', async () => {
        const spy = jest.spyOn(gameThree, 'startGame').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree.startGame();
        jest.advanceTimersByTime(InitialParameters.COUNTDOWN_TIME_GAME_START);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit a GameHasStarted event', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED) {
                eventCalled = true;
            }
        });
        gameThree.startGame();
        expect(eventCalled).toBeTruthy();
    });

    it('should initialise stageController after start countdown', async () => {
        gameThree.startGame();
        advanceCountdown(InitialParameters.COUNTDOWN_TIME_GAME_START);

        expect(StageController).toHaveBeenCalledTimes(1);
    });
});
