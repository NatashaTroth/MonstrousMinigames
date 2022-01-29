import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhoto } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GAME_THREE_EVENT_MESSAGE__NEW_ROUND,
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS, GameThreeEventMessage, VoteForPhotos
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, mockPhotoUrl, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';
import { photoMessage, receiveMultiplePhotos, receiveSinglePhoto } from '../gameThreeMockData';

let gameThree: GameThree;
const gameEventEmitter = DI.resolve(GameEventEmitter);

describe('Initiate stage', () => {
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    afterEach(() => {
        gameEventEmitter.removeAllListeners();
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
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
    });

    afterEach(() => {
        gameEventEmitter.removeAllListeners();
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should not emit the Voting event when only one photo is sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });
        gameThree.receiveInput(photoMessage);
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
            const newMessage = { ...photoMessage, photographerId: user.id };
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
            const newMessage = { ...photoMessage, photographerId: user.id };
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
            const newMessage = { ...photoMessage, photographerId: user.id };
            gameThree.receiveInput(newMessage);
        });

        expect(eventData!.photoUrls[0].url).toBe(photoMessage.url);
    });

    it('should not emit the Voting event when taking photo countdown has not run out', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME - 1
        );

        expect(eventCalled).toBeFalsy();
    });

    it('should emit the Voting event when taking photo countdown runs out and multiple photos were sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });
        receiveMultiplePhotos(gameThree);
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );

        expect(eventCalled).toBeTruthy();
    });

    it('should not emit the Voting event when taking photo countdown runs out and only one photo was sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });
        receiveSinglePhoto(gameThree);
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );

        expect(eventCalled).toBeFalsy();
    });

    it('should not emit the Voting event when taking photo countdown runs out and no photos were sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        expect(eventCalled).toBeFalsy();
    });

    it('should not emit the new round when taking photo countdown runs out and only one photo was sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__NEW_ROUND) {
                eventCalled = true;
            }
        });
        receiveSinglePhoto(gameThree);
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );

        expect(eventCalled).toBeTruthy();
    });

    it('should not emit the new round event when taking photo countdown runs out and no photos were sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__NEW_ROUND) {
                eventCalled = true;
            }
        });
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        expect(eventCalled).toBeTruthy();
    });

    it('should return the correct photo urls', async () => {
        let eventData: undefined | VoteForPhotos;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventData = message;
            }
        });

        const photoUrls: string[] = [];
        users.forEach((user, idx) => {
            const url = `https://mockPhoto${idx}.com`;
            const msg: IMessagePhoto = { type: photoMessage.type, photographerId: user.id, url };
            gameThree.receiveInput(msg);
            photoUrls.push(url);
        });
        expect(eventData?.photoUrls.map(photoUrl => photoUrl.url)).toEqual(expect.arrayContaining(photoUrls));
    });

    it('should return the correct photographerIds', async () => {
        let eventData: undefined | VoteForPhotos;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventData = message;
            }
        });

        const photographerIds: string[] = [];
        users.forEach((user, idx) => {
            const msg: IMessagePhoto = { type: photoMessage.type, photographerId: user.id, url: mockPhotoUrl };
            gameThree.receiveInput(msg);
            photographerIds[idx] = user.id;
        });
        expect(eventData?.photoUrls.map(photoUrl => photoUrl.photographerId)).toEqual(
            expect.arrayContaining(photographerIds)
        );
    });

    it('should only emit urls from photographers who took photos', async () => {
        let eventData: undefined | VoteForPhotos;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventData = message;
            }
        });

        const photographerIds: string[] = [];
        const otherPlayers = Array.from(gameThree.players.values()).filter(player => player.id !== users[0].id);
        otherPlayers.forEach((user, idx) => {
            const msg: IMessagePhoto = { type: photoMessage.type, photographerId: user.id, url: mockPhotoUrl };
            gameThree.receiveInput(msg);
            photographerIds[idx] = user.id;
        });

        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );

        expect(eventData?.photoUrls.length).toBe(otherPlayers.length);
        expect(eventData?.photoUrls.map(photoUrl => photoUrl.photographerId)).toEqual(
            expect.arrayContaining(photographerIds)
        );
    });

    it('should not add a photo for for a user who does not exist', () => {
        let eventData: undefined | VoteForPhotos;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventData = message;
            }
        });

        const msg: IMessagePhoto = { type: photoMessage.type, photographerId: 'xxxxxxx', url: mockPhotoUrl };
        gameThree.receiveInput(msg);

        expect(eventData?.photoUrls).toBe(undefined);
    });
});
