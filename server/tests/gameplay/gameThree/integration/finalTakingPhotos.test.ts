import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhoto } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
    GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN, GameThreeEventMessage
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';
import { receiveMultiplePhotos } from '../gameThreeMockData';

let gameThree: GameThree;
const gameEventEmitter = DI.resolve(GameEventEmitter);

// let gameEventEmitter: GameEventEmitter;

const mockPhotoUrl = 'https://mockPhoto.com';
const message: IMessagePhoto = { type: GameThreeMessageTypes.PHOTO, url: mockPhotoUrl, photographerId: users[0].id };

describe('Initiate stage', () => {
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        gameThree['stageController']!['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        receiveMultiplePhotos(gameThree);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
    });

    afterEach(() => {
        gameEventEmitter.removeAllListeners();
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the taking final photos when final round starts', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);

        expect(eventCalled).toBeTruthy();
    });
});

describe('Taking Photo', () => {
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        gameThree['stageController']!['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        receiveMultiplePhotos(gameThree);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
    });

    afterEach(() => {
        gameEventEmitter.removeAllListeners();
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should not emit the Present Photos event when only one photo is sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });
        gameThree.receiveInput(message);
        expect(eventCalled).toBeFalsy();
    });

    it('should emit the Present Final Photos event when all photos were sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });
        users.forEach(user => {
            const newMessage = { ...message, photographerId: user.id };
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree.receiveInput(newMessage);
            }
        });

        expect(eventCalled).toBeTruthy();
    });

    it('should not emit the Present Final Photos event when taking photo countdown has not run out', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS - 1);

        expect(eventCalled).toBeFalsy();
    });

    it('should emit the Present Final Photos event when taking photo countdown runs out', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);

        expect(eventCalled).toBeTruthy();
    });
});
