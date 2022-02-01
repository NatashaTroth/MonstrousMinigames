import 'reflect-metadata';

import { container } from 'tsyringe';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameState } from '../../../../src/gameplay/enums';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage, GlobalGameHasFinished
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import RankPoints from '../../../../src/gameplay/leaderboard/classes/RankPoints';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import {
    addPointsToPlayer, advanceCountdown, startGameAdvanceCountdown, startNewRound,
    switchToSecondToLastRound
} from '../gameThreeHelperFunctions';
import { receiveMultiplePhotos } from '../gameThreeMockData';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Initiate stage', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    afterAll(() => {
        container.resolve(GameEventEmitter).cleanUpListeners();
    });

    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        switchToSecondToLastRound(gameThree);
        startNewRound(gameThree);
        receiveMultiplePhotos(gameThree); // to pass no photos error in FinalPhotosStage
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
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
    let votesArray: number[] = [];

    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        switchToSecondToLastRound(gameThree);
        startNewRound(gameThree);
        receiveMultiplePhotos(gameThree); // to pass no photos error in FinalPhotosStage
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        users.forEach(() => advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS));
        // add votes

        votesArray = addPointsToPlayer(gameThree, users);

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

    it('should emit the votes sorted in descending order', async () => {
        expect(eventData.data.playerRanks.map(result => result.votes)).toStrictEqual(votesArray.sort((a, b) => b - a));
    });

    it('should emit the votes sorted in descending order (0 and 1st place)', async () => {
        expect(eventData.data.playerRanks[0].votes).toBeGreaterThanOrEqual(eventData.data.playerRanks[1].votes);
    });

    it('should emit the votes sorted in descending order (1st and 2nd place)', async () => {
        expect(eventData.data.playerRanks[1].votes).toBeGreaterThanOrEqual(eventData.data.playerRanks[2].votes);
    });

    it('should emit the votes sorted in descending order (2nd and 3rd place)', async () => {
        expect(eventData.data.playerRanks[2].votes).toBeGreaterThanOrEqual(eventData.data.playerRanks[3].votes);
    });

    it('should emit the votes sorted in descending order (2nd and 3rd place)', async () => {
        expect(eventData.data.playerRanks[2].votes).toBeGreaterThanOrEqual(eventData.data.playerRanks[3].votes);
    });

    it('should emit the points sorted in descending order', async () => {
        const pointsArray = eventData.data.playerRanks.map(result => result.points);
        expect(pointsArray).toStrictEqual(pointsArray.sort((a, b) => b - a));
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

    it('should emit the points for rank 1', async () => {
        expect(eventData.data.playerRanks[0].points).toBe(RankPoints.getPointsFromRank(1));
    });

    it('should emit the points for rank 2', async () => {
        expect(eventData.data.playerRanks[1].points).toBe(RankPoints.getPointsFromRank(2));
    });

    it('should emit the points for rank 3', async () => {
        expect(eventData.data.playerRanks[2].points).toBe(RankPoints.getPointsFromRank(3));
    });

    it('should emit the points for rank 4', async () => {
        expect(eventData.data.playerRanks[3].points).toBe(RankPoints.getPointsFromRank(4));
    });
});
