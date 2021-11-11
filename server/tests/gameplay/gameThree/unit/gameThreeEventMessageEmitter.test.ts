import 'reflect-metadata';

import Room from '../../../../src/classes/room';
import DI from '../../../../src/di';
import { GameThree } from '../../../../src/gameplay';
import {
    GameThreeEventMessageEmitter
} from '../../../../src/gameplay/gameThree/GameThreeEventMessageEmitter';
import { NamespaceAdapter } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GAME_THREE_EVENT_MESSAGE__NEW_ROUND,
    GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS, GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
    GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN,
    GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER,
    GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS, GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS,
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS, GameThreeNewRound, NewPhotoTopicInfo,
    PhotoVotingResults, PresentFinalPhotos, TakeFinalPhotosCountdown, TakePhotoCountdownOver,
    ViewingFinalPhotos, VoteForFinalPhotos, VoteForPhotos
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { leaderboard, mockPhotoUrl, roomId, users } from '../../mockData';

let gameThree: GameThree;
let gameThreeEventMessageEmitter: GameThreeEventMessageEmitter;

const controllerSpaceEmit = jest.fn((messageName, message) => {
    /*do nothing*/
});

const screenSpaceEmit = jest.fn((messageName, message) => {
    /*do nothing*/
});

const controllerNamespace: NamespaceAdapter = {
    to: jest.fn(roomId => controllerNamespace),
    emit: controllerSpaceEmit,
};

const screenNamespace: NamespaceAdapter = {
    to: jest.fn(roomId => screenNamespace),
    emit: screenSpaceEmit,
};

const room = new Room('xx');
const countdownTime = 500;
const topic = 'cats';
const roundIdx = 1;
const photoUrls = [{ photographerId: users[0].id, url: mockPhotoUrl, photoId: 1 }];
const votingResults = [{ photographerId: users[0].id, points: 5 }];
const finalVotingResults = [{ photographerId: users[0].id, points: 5, rank: 1 }];

describe('Can handle function', () => {
    beforeAll(() => {
        gameThreeEventMessageEmitter = DI.resolve(GameThreeEventMessageEmitter);
    });

    beforeEach(async () => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    it('should return false for a wrong message type', async () => {
        expect(gameThreeEventMessageEmitter.canHandle({ type: 'test', roomId: 'xx' }, gameThree)).toBeFalsy();
    });

    it('should return true for a correct message type', async () => {
        expect(
            gameThreeEventMessageEmitter.canHandle(
                { type: GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, roomId: 'xx' },
                gameThree
            )
        ).toBeTruthy();
    });
});

describe('Handle function send to controller', () => {
    beforeAll(() => {
        gameThreeEventMessageEmitter = DI.resolve(GameThreeEventMessageEmitter);
    });

    beforeEach(async () => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    it('should emit GAME_THREE_EVENT_MESSAGE__NEW_ROUND ', () => {
        const message: GameThreeNewRound = {
            type: GAME_THREE_EVENT_MESSAGE__NEW_ROUND,
            roomId,
            roundIdx,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC', () => {
        const message: NewPhotoTopicInfo = {
            type: GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC,
            roomId,
            topic,
            countdownTime,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER', () => {
        const message: TakePhotoCountdownOver = {
            type: GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER,
            roomId,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS', () => {
        const message: VoteForPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS,
            roomId,
            countdownTime,
            photoUrls,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS', () => {
        const message: PhotoVotingResults = {
            type: GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS,
            roomId,
            countdownTime,
            results: votingResults,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN', () => {
        const message: TakeFinalPhotosCountdown = {
            type: GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN,
            roomId,
            countdownTime,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS', () => {
        const message: PresentFinalPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
            roomId,
            countdownTime,
            photographerId: users[0].id,
            photoUrls: [mockPhotoUrl],
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS', () => {
        const message: VoteForFinalPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS,
            roomId,
            countdownTime,
            photographers: [{ id: users[0].id, name: users[0].name }],
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS', () => {
        const message: ViewingFinalPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS,
            roomId,
            results: finalVotingResults,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(controllerSpaceEmit).toHaveBeenCalledWith('message', message);
    });
});

describe('Handle function send to screen', () => {
    beforeAll(() => {
        // gameEventEmitter = DI.resolve(GameEventEmitter);
        gameThreeEventMessageEmitter = DI.resolve(GameThreeEventMessageEmitter);
    });

    beforeEach(async () => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    // export interface NamespaceAdapter {
    //     to: (roomId: string) => NamespaceAdapter;
    //     emit: (messageName: string, message: GameThreeEventMessage) => void;
    // }

    it('should emit GAME_THREE_EVENT_MESSAGE__NEW_ROUND ', () => {
        const message: GameThreeNewRound = {
            type: GAME_THREE_EVENT_MESSAGE__NEW_ROUND,
            roomId,
            roundIdx,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC', () => {
        const message: NewPhotoTopicInfo = {
            type: GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC,
            roomId,
            topic,
            countdownTime,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER', () => {
        const message: TakePhotoCountdownOver = {
            type: GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER,
            roomId,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS', () => {
        const message: VoteForPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS,
            roomId,
            countdownTime,
            photoUrls,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS', () => {
        const message: PhotoVotingResults = {
            type: GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS,
            roomId,
            countdownTime,
            results: votingResults,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN', () => {
        const message: TakeFinalPhotosCountdown = {
            type: GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN,
            roomId,
            countdownTime,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS', () => {
        const message: PresentFinalPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
            roomId,
            countdownTime,
            photographerId: users[0].id,
            photoUrls: [mockPhotoUrl],
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS', () => {
        const message: VoteForFinalPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS,
            roomId,
            countdownTime,
            photographers: [{ id: users[0].id, name: users[0].name }],
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
    });

    it('should call emit GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS', () => {
        const message: ViewingFinalPhotos = {
            type: GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS,
            roomId,
            results: finalVotingResults,
        };

        gameThreeEventMessageEmitter.handle(controllerNamespace, screenNamespace, room, message);
        expect(screenSpaceEmit).toHaveBeenCalledWith('message', message);
    });
});
