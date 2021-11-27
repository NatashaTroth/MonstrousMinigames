import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameState } from '../../../../src/gameplay/enums';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage, GlobalGameHasFinished
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
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
        const stageController = gameThree['stageController']!;
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController!['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1; //skip to final round
        stageController!.handleNewRound();
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS));
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the GameHasFinished event when voting is over', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventCalled).toBeTruthy();
    });
});

describe('Final results', () => {
    let eventData: GlobalGameHasFinished = {
        type: GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED,
        roomId: 'xxx',
        data: {
            roomId: 'xx',
            gameState: GameState.Finished,
            playerRanks: [],
        },
    };
    const pointsArray: number[] = [];

    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        const stageController = gameThree['stageController']!;
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController!['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1; //skip to final round
        stageController!.handleNewRound();
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS));
        // add points

        users.forEach((user, idx) => {
            pointsArray.push(stageController['playerPoints'].getPointsFromPlayer(user.id)); // get points from before (from sending final photo)
            for (let i = 0; i < InitialParameters.NUMBER_ROUNDS; i++) {
                stageController['playerPoints'].addPointsToPlayer(user.id, idx);
                pointsArray[idx] += idx;
            }
        });

        // get final results
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the points sorted in descending order', async () => {
        expect(eventData.data.playerRanks.map(result => result.points)).toStrictEqual(
            pointsArray.sort((a, b) => b - a)
        );
    });

    it('should emit the points sorted in descending order (0 and 1st place)', async () => {
        expect(eventData.data.playerRanks[0].points).toBeGreaterThanOrEqual(eventData.data.playerRanks[1].points);
    });

    it('should emit the points sorted in descending order (1st and 2nd place)', async () => {
        expect(eventData.data.playerRanks[1].points).toBeGreaterThanOrEqual(eventData.data.playerRanks[2].points);
    });

    it('should emit the points sorted in descending order (2nd and 3rd place)', async () => {
        expect(eventData.data.playerRanks[2].points).toBeGreaterThanOrEqual(eventData.data.playerRanks[3].points);
    });

    it('should emit the points sorted in descending order (2nd and 3rd place)', async () => {
        expect(eventData.data.playerRanks[2].points).toBeGreaterThanOrEqual(eventData.data.playerRanks[3].points);
    });

    it('should emit the rank 1', async () => {
        expect(eventData.data.playerRanks[0].rank).toBe(1);
    });

    it('should emit the rank 2', async () => {
        expect(eventData.data.playerRanks[1].rank).toBe(2);
    });

    it('should emit the rank 3', async () => {
        expect(eventData.data.playerRanks[2].rank).toBe(3);
    });

    it('should emit the rank 4', async () => {
        expect(eventData.data.playerRanks[3].rank).toBe(4);
    });
});
