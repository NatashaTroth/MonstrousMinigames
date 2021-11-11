import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS, GameThreeEventMessage
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Initiate stage', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the PhotoVotingResults event when the viewing results stage starts', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventCalled).toBeTruthy();
    });
});

describe('Viewing results', () => {
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should increase roundIdx when countdown is over', async () => {
        const initialRoundIdx = gameThree['stageController']['_roundIdx'];
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(gameThree['stageController']['_roundIdx']).toBe(initialRoundIdx + 1);
    });

    it('should set gameThreeGameState to TakingPhoto when not the final round when countdown is over', async () => {
        gameThree['stageController']['_roundIdx'] = 0;
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.TakingPhoto);
    });

    it('should set gameThreeGameState to Final when not the final round when countdown is over', async () => {
        gameThree['stageController']['_roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.TakingFinalPhotos);
    });
});
