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
    GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS, GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS,
    GameThreeEventMessage, PresentFinalPhotos
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';

let gameThree: GameThree;
const gameEventEmitter = DI.resolve(GameEventEmitter);

const mockPhotoUrl = 'https://mockPhoto.com';
const message: IMessagePhoto = { type: GameThreeMessageTypes.PHOTO, url: mockPhotoUrl, photographerId: users[0].id };

describe('Taking Photo', () => {
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        gameThree['stageController']!['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        users.forEach(user => {
            const newMessage = { ...message, photographerId: user.id };
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                newMessage.url = `https://mockPhoto${user.id}-${i}.com`;
                gameThree.receiveInput(newMessage);
            }
        });
    });

    afterEach(() => {
        gameEventEmitter.removeAllListeners();
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the PresentingFinalPhotos event when countdown runs out and not all players have presented', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);

        expect(eventCalled).toBeTruthy();
    });

    it('should emit the PresentingFinalPhotos event with the photographers name for presenting', async () => {
        let eventData: PresentFinalPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
            roomId: '',
            countdownTime: 0,
            photographerId: '',
            name: '',
            photoUrls: [],
        };

        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventData = message;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);

        expect(eventData.name).toBe(gameThree.players.get(eventData.photographerId)!.name);
    });

    it('should emit the PresentingFinalPhotos event with the correct number of urls', async () => {
        let eventData: PresentFinalPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
            roomId: '',
            countdownTime: 0,
            photographerId: '',
            name: '',
            photoUrls: [],
        };

        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventData = message;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);

        expect(eventData.photoUrls.length).toEqual(InitialParameters.NUMBER_FINAL_PHOTOS);
    });

    it('should emit the VoteForPhotos event when all the presentations are over', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });

        for (let i = 0; i < users.length; i++) {
            advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        }

        expect(eventCalled).toBeTruthy();
    });
});
