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
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS,
    GameThreeEventMessage, VoteForPhotos
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';

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
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the NewPhotoTopic event when game starts', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC) {
                eventCalled = true;
            }
        });
        startGameAdvanceCountdown(gameThree);
        expect(eventCalled).toBeTruthy();
    });
});

describe('Taking Photo', () => {
    beforeEach(() => {
        // console.log(
        //     '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
        // );
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    // it('should allow client to send a photo within the countdown time', async () => {
    //     gameThree['handleInput'](message);
    //     expect(
    //         gameThree.players.get(users[0].id)!.hasReceivedPhoto(gameThree['stageController']!['_roundIdx'])
    //     ).toBeTruthy();
    //     expect(gameThree.players.get(users[0].id)!.getUrl(gameThree['stageController']!['_roundIdx'])).toBe(
    //         mockPhotoUrl
    //     );
    // });

    it('should not emit the Voting event when only one photo is sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });
        gameThree.receiveInput(message);
        expect(eventCalled).toBeFalsy();
    });

    it('should emit the Voting event when all photos were sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });
        users.forEach(user => {
            const newMessage = { ...message, photographerId: user.id };
            gameThree.receiveInput(newMessage);
        });

        expect(eventCalled).toBeTruthy();
    });

    it('should send all the correct number of photos with voting message', async () => {
        let eventData: VoteForPhotos;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventData = message;
            }
        });
        users.forEach(user => {
            const newMessage = { ...message, photographerId: user.id };
            gameThree.receiveInput(newMessage);
        });

        expect(eventData!.photoUrls.length).toBe(users.length);
    });

    it('should send the photo urls from the message with voting message', async () => {
        let eventData: VoteForPhotos;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventData = message;
            }
        });
        users.forEach(user => {
            const newMessage = { ...message, photographerId: user.id };
            gameThree.receiveInput(newMessage);
        });

        expect(eventData!.photoUrls[0].url).toBe(message.url);
    });

    it('should not emit the Voting event when taking photo countdown has not run out', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO - 1);

        expect(eventCalled).toBeFalsy();
    });

    it('should emit the Voting event when taking photo countdown runs out', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);

        expect(eventCalled).toBeTruthy();
    });

    // it('should have received all photos when all photos have been sent', async () => {
    //     users.forEach(user => {
    //         gameThree['handleInput']({ ...message, userId: user.id });
    //     });

    //     expect(gameThree['allPhotosReceived']()).toBeTruthy();
    // });

    // it('should change state to Voting when all photos have been received', async () => {
    //     users.forEach(user => {
    //         gameThree['handleInput']({ ...message, userId: user.id });
    //     });
    //     expect(gameThree['stageController']!.stage).toBe(GameThreeGameState.Voting);
    // });

    // it('should stop the countdown when all photos have been received', async () => {
    //     const spy = jest.spyOn(Countdown.prototype as any, 'stopCountdown');
    //     users.forEach(user => {
    //         gameThree['handleInput']({ ...message, userId: user.id });
    //     });
    //     expect(spy).toBeCalledTimes(1);
    // });

    // it('should change state to Voting when countdown runs out', async () => {
    //     advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
    //     expect(gameThree['stageController']!.stage).toBe(GameThreeGameState.Voting);
    // });

    // it('should not accept new photos when time has run out', async () => {
    //     advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
    //     gameThree['handleInput'](message);
    //     expect(
    //         gameThree.players.get(users[0].id)!.hasReceivedPhoto(gameThree['stageController']!['_roundIdx'])
    //     ).toBeFalsy();
    //     expect(gameThree.players.get(users[0].id)!.getUrl(gameThree['stageController']!['_roundIdx'])).toBe('');
    // });

    it.todo('should not add a photo for for a user who does not exist');
    // it('should not add a photo for for a user who does not exist', () => {
    //     photos.addPhoto('xxxxxxx', mockPhotoUrl);
    //     expect(photos.getPhotos().length).toBe(0);
    // });
});
