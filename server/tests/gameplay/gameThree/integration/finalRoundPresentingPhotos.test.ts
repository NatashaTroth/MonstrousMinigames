import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { Countdown } from '../../../../src/gameplay/gameThree/classes/Countdown';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhoto } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS, GameThreeEventMessage, PresentFinalPhotos
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { IMessage } from '../../../../src/interfaces/messages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

const mockPhotoUrl = 'https://mockPhoto.com';
const photoMessage: IMessagePhoto = { type: GameThreeMessageTypes.PHOTO, url: mockPhotoUrl, userId: users[0].id };
const finishPresentingMessage: IMessage = { type: GameThreeMessageTypes.FINISHED_PRESENTING };

describe('Initiate stage', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        gameThree['stageController']!['_roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['stageController']!.handleNewRound();
        // advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS);
        //all users send photos
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the PresentingFinalPhotos event when the taking final photo stage starts', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...photoMessage, userId: user.id });
            }
        });
        expect(eventCalled).toBeTruthy();
    });

    it('should emit the PresentingFinalPhotos event in which all players photos are sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...photoMessage, userId: user.id });
            }
        });
        expect(eventCalled).toBeTruthy();
    });
});

describe('Presenting Final Photos', () => {
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        gameThree['stageController']!['_roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['stageController']!.handleNewRound();
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...photoMessage, userId: user.id });
            }
        });
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should stop the countdown when finished presenting message is received', async () => {
        const spy = jest.spyOn(Countdown.prototype as any, 'stopCountdown');
        gameThree['handleInput'](finishPresentingMessage);
        expect(spy).toBeCalledTimes(1);
    });

    it('should change keep the state PresentingFinalPhotos when countdown runs out and not all players have presented', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
        expect(gameThree['stageController']!.stage).toBe(GameThreeGameState.PresentingFinalPhotos);
    });

    it('should change the state to FinalVoting when countdown runs out and all players have presented', async () => {
        for (let i = 0; i < users.length - 1; i++) {
            gameThree['handleInput'](finishPresentingMessage);
        }

        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
        expect(gameThree['stageController']!.stage).toBe(GameThreeGameState.FinalVoting);
    });

    it('should emit the PresentingFinalPhotos event when countdown runs out and not all players have presented', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);

        expect(eventCalled).toBeTruthy();
    });

    it('should reduce the number of players to present when a new presenting round starts', async () => {
        const initialNumberPresenters = gameThree['presentationController']!['playerPresentOrder'].length;
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
        expect(gameThree['presentationController']!['playerPresentOrder'].length).toBe(initialNumberPresenters - 1);
    });

    it('should emit the PresentingFinalPhotos event with the countdown time for presenting', async () => {
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
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);

        expect(eventData.countdownTime).toBe(InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
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
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);

        expect(eventData.name).toBe(gameThree.players.get(eventData.photographerId)!.name);
    });

    it('should emit the PresentingFinalPhotos event with the urls of that player', async () => {
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
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);

        expect(eventData.photoUrls).toEqual(
            expect.arrayContaining(gameThree.players.get(eventData.photographerId)!.finalRoundInfo.urls)
        );
    });
});
