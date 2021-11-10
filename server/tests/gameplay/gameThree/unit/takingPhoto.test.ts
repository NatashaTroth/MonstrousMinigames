import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { InvalidUrlError } from '../../../../src/gameplay/gameThree/customErrors';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhoto } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS, GameThreeEventMessage, VoteForPhotos
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;
const mockPhotoUrl = 'https://mockPhoto.com';

const message: IMessagePhoto = {
    type: GameThreeMessageTypes.PHOTO,
    userId: users[0].id,
    url: mockPhotoUrl,
};

describe('Handle taking photo', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call sendPhotosToScreen when countdown is over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'sendPhotosToScreen');

        gameThree['countdownTimeLeft'] = 0;
        gameThree['handleFinishedTakingPhoto']();
        expect(spy).toBeCalledTimes(1);
    });
});

describe('Handle received photo', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        gameThree['gameThreeGameState'] = GameThreeGameState.TakingPhoto;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set the photo received property on the player to true', async () => {
        gameThree['handleReceivedPhoto'](message);
        expect(gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']].received).toBeTruthy();
    });

    it('should not set the received property to true, if gameThreeGameState is not TakingPhoto', async () => {
        gameThree['gameThreeGameState'] = GameThreeGameState.BeforeStart;
        gameThree['handleReceivedPhoto'](message);
        expect(gameThree.players.get(message.userId)!.roundInfo[gameThree['roundIdx']].received).toBeFalsy();
    });

    it('should save the photo url to the player', async () => {
        gameThree['handleReceivedPhoto'](message);
        expect(gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']].url).toBe(message.url);
    });

    fit('should not save the photo url for a new photo when a photo has already been received', async () => {
        gameThree['handleReceivedPhoto'](message);
        const newUrl = 'https://mockPhoto2.com';
        gameThree['handleReceivedPhoto']({ ...message, url: newUrl });
        expect(gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']].url).toBe(message.url);
    });

    it('should throw an InvalidUrlError when url is not valid', async () => {
        const newMessage = { ...message };
        newMessage.url = 'notAUrl';
        expect(() => gameThree['handleReceivedPhoto'](newMessage)).toThrowError(InvalidUrlError);
    });

    it('should add the userId in the InvalidUrlError', async () => {
        const newMessage = { ...message };
        newMessage.url = 'notAUrl';

        try {
            gameThree['handleReceivedPhoto'](newMessage);
        } catch (e: any) {
            expect(e.userId).toBe(newMessage.userId);
        }
    });

    it('should call handleAllPhotosReceived if all photos have been received', async () => {
        //set the other players received photo to true
        const otherPlayers = Array.from(gameThree.players.values()).filter(player => player.id !== users[0].id);
        otherPlayers.forEach(player => {
            player.roundInfo[gameThree['roundIdx']].received = true;
        });

        const spy = jest.spyOn(GameThree.prototype as any, 'handleAllPhotosReceived').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree['handleReceivedPhoto'](message);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call handleAllPhotosReceived if not all photos have been received', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleAllPhotosReceived').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree['handleReceivedPhoto'](message);
        expect(spy).not.toHaveBeenCalled();
    });
});

describe('All photos received', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when all photos are received', async () => {
        Array.from(gameThree.players.values()).forEach(player => {
            player.roundInfo[gameThree['roundIdx']].received = true;
        });
        expect(gameThree['allPhotosReceived']()).toBeTruthy();
    });

    it('should return false when not all photos are received', async () => {
        Array.from(gameThree.players.values()).forEach(player => {
            player.roundInfo[gameThree['roundIdx']].received = true;
        });

        gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']].received = false;
        expect(gameThree['allPhotosReceived']()).toBeFalsy();
    });
});

let gameEventEmitter: GameEventEmitter;
describe('Send Photos to screen', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should emit a VoteForPhotosEvent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });

        gameThree['sendPhotosToScreen']();
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
        Array.from(gameThree.players.values()).forEach((player, idx) => {
            player.roundInfo[gameThree['roundIdx']].received = true;
            player.roundInfo[gameThree['roundIdx']].url = idx.toString();
            photoUrls.push(idx.toString());
        });

        gameThree['sendPhotosToScreen']();
        expect(eventData?.photoUrls.map(photoUrl => photoUrl.url)).toEqual(expect.arrayContaining(photoUrls));
    });

    it('should return the correct photographer ids', async () => {
        let eventData: undefined | VoteForPhotos;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventData = message;
            }
        });

        const photographerIds: string[] = [];
        Array.from(gameThree.players.values()).forEach((player, idx) => {
            player.roundInfo[gameThree['roundIdx']].received = true;
            player.roundInfo[gameThree['roundIdx']].url = idx.toString();
            photographerIds[idx] = player.id;
        });

        gameThree['sendPhotosToScreen']();
        expect(eventData?.photoUrls.map(photoUrl => photoUrl.photographerId)).toEqual(
            expect.arrayContaining(photographerIds)
        );
    });

    it('should return the incrementing photoId', async () => {
        let eventData: undefined | VoteForPhotos;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventData = message;
            }
        });

        const photographerIds: string[] = [];
        Array.from(gameThree.players.values()).forEach((player, idx) => {
            player.roundInfo[gameThree['roundIdx']].received = true;
            player.roundInfo[gameThree['roundIdx']].url = idx.toString();
            photographerIds[idx] = player.id;
        });

        gameThree['sendPhotosToScreen']();
        console.log(eventData);
        expect(eventData?.photoUrls.map(photoUrl => photoUrl.photoId)).toEqual(
            expect.arrayContaining(Array.from({ length: eventData!.photoUrls.length }, (_, i) => i + 1))
        );
    });

    it('should only emit urls from photographers who took photos', async () => {
        let eventData: undefined | VoteForPhotos;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventData = message;
            }
        });

        const photoUrls = 'a';
        const photographerIds: string[] = [];
        const otherPlayers = Array.from(gameThree.players.values()).filter(player => player.id !== users[0].id);
        otherPlayers.forEach((player, idx) => {
            player.roundInfo[gameThree['roundIdx']].received = true;
            player.roundInfo[gameThree['roundIdx']].url = photoUrls;
            photographerIds[idx] = player.id;
        });

        gameThree['sendPhotosToScreen']();
        expect(eventData?.photoUrls.length).toBe(otherPlayers.length);
        expect(eventData?.photoUrls.map(photoUrl => photoUrl.photographerId)).toEqual(
            expect.arrayContaining(photographerIds)
        );
    });

    it('should initiate the voting countdown', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'initiateCountdown');

        gameThree['sendPhotosToScreen']();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(InitialParameters.COUNTDOWN_TIME_VOTE);
    });

    it('should set gameThreeGameState to Voting', async () => {
        gameThree['sendPhotosToScreen']();
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.Voting);
    });
});
