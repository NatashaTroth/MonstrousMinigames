import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
// import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState'; //TODO test
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhoto } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS, GameThreeEventMessage, ViewingFinalPhotos
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

const mockPhotoUrl = 'https://mockPhoto.com';
const photoMessage: IMessagePhoto = { type: GameThreeMessageTypes.PHOTO, url: mockPhotoUrl, userId: users[0].id };

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
        gameThree['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['handleNewRound']();
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...photoMessage, userId: user.id });
            }
        });
        const numberPresentations = Array.from(gameThree.players.values()).filter(
            player => player.finalRoundInfo.received
        ).length;
        for (let i = 0; i < numberPresentations; i++) {
            advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
        }
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the FinalResults event when voting is over', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventCalled).toBeTruthy();
    });
});

describe('Final results', () => {
    let eventData: ViewingFinalPhotos = {
        type: GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS,
        roomId: 'xxx',
        results: [],
    };
    const pointsArray: number[] = [];

    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        gameThree['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['handleNewRound']();
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...photoMessage, userId: user.id });
            }
        });
        const numberPresentations = Array.from(gameThree.players.values()).filter(
            player => player.finalRoundInfo.received
        ).length;
        for (let i = 0; i < numberPresentations; i++) {
            advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
        }
        // add points
        Array.from(gameThree.players.values()).forEach((player, idx) => {
            pointsArray.push(0);
            for (let i = 0; i < InitialParameters.NUMBER_ROUNDS - 1; i++) {
                player.addPoints(1, idx);
                pointsArray[idx] += idx;
            }
            player.addPointsFinalRound(idx);
            pointsArray[idx] += idx;
        });

        // get final results
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS) {
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
        expect(eventData.results.map(result => result.points)).toStrictEqual(pointsArray.sort((a, b) => b - a));
    });

    it('should emit the points sorted in descending order (0 and 1st place)', async () => {
        expect(eventData.results[0].points).toBeGreaterThanOrEqual(eventData.results[1].points);
    });
    it('should emit the points sorted in descending order (1st and 2nd place)', async () => {
        expect(eventData.results[1].points).toBeGreaterThanOrEqual(eventData.results[2].points);
    });
    it('should emit the points sorted in descending order (2nd and 3rd place)', async () => {
        expect(eventData.results[2].points).toBeGreaterThanOrEqual(eventData.results[3].points);
    });
});
