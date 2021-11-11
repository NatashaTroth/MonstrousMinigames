import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { Countdown } from '../../../../src/gameplay/gameThree/classes/Countdown';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
    GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN, GameThreeEventMessage,
    TakeFinalPhotosCountdown
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Send take final photos countdown', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should emit a TakeFinalPhotosCountdown event', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN) {
                eventCalled = true;
            }
        });
        gameThree['sendTakeFinalPhotosCountdown']();
        expect(eventCalled).toBeTruthy();
    });

    it('should send countdown time to take final photos', async () => {
        let eventData: undefined | TakeFinalPhotosCountdown;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN) {
                eventData = message;
            }
        });
        gameThree['sendTakeFinalPhotosCountdown']();
        expect(eventData?.countdownTime).toBe(InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS);
    });

    it('should initiate the takingFinalPhotos countdown', async () => {
        const spy = jest.spyOn(Countdown.prototype as any, 'initiateCountdown');

        gameThree['sendTakeFinalPhotosCountdown']();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS);
    });

    it('should set gameThreeGameState to TakingFinalPhotos', async () => {
        gameThree['sendTakeFinalPhotosCountdown']();
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.TakingFinalPhotos);
    });
});

describe('Send final photos to screen', () => {
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

    it.skip('should emit a PresentFinalPhotosEvent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });

        gameThree['sendFinalPhotosToScreen']();
        expect(eventCalled).toBeTruthy();
    });

    // it('should return the correct photo urls', async () => {
    //     let eventData: undefined | VoteForPhotos;
    //     gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
    //         if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
    //             eventData = message;
    //         }
    //     });

    //     const photoUrls: string[] = [];
    //     Array.from(gameThree.players.values()).forEach((player, idx) => {
    //         player.roundInfo[gameThree['stageController']['_roundIdx']].received = true;
    //         player.roundInfo[gameThree['stageController']['_roundIdx']].url = idx.toString();
    //         photoUrls.push(idx.toString());
    //     });

    //     gameThree['sendPhotosToScreen']();
    //     expect(eventData?.photoUrls.map(photoUrl => photoUrl.url)).toEqual(expect.arrayContaining(photoUrls));
    // });

    // it('should return the correct photographer ids', async () => {
    //     let eventData: undefined | VoteForPhotos;
    //     gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
    //         if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
    //             eventData = message;
    //         }
    //     });

    //     const photographerIds: string[] = [];
    //     Array.from(gameThree.players.values()).forEach((player, idx) => {
    //         player.roundInfo[gameThree['stageController']['_roundIdx']].received = true;
    //         player.roundInfo[gameThree['stageController']['_roundIdx']].url = idx.toString();
    //         photographerIds[idx] = player.id;
    //     });

    //     gameThree['sendPhotosToScreen']();
    //     expect(eventData?.photoUrls.map(photoUrl => photoUrl.photographerId)).toEqual(
    //         expect.arrayContaining(photographerIds)
    //     );
    // });

    // it('should only emit urls from photographers who took photos', async () => {
    //     let eventData: undefined | VoteForPhotos;
    //     gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
    //         if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
    //             eventData = message;
    //         }
    //     });

    //     const photoUrls = 'a';
    //     const photographerIds: string[] = [];
    //     const otherPlayers = Array.from(gameThree.players.values()).filter(player => player.id !== users[0].id);
    //     otherPlayers.forEach((player, idx) => {
    //         player.roundInfo[gameThree['stageController']['_roundIdx']].received = true;
    //         player.roundInfo[gameThree['stageController']['_roundIdx']].url = photoUrls;
    //         photographerIds[idx] = player.id;
    //     });

    //     gameThree['sendPhotosToScreen']();
    //     expect(eventData?.photoUrls.length).toBe(otherPlayers.length);
    //     expect(eventData?.photoUrls.map(photoUrl => photoUrl.photographerId)).toEqual(
    //         expect.arrayContaining(photographerIds)
    //     );
    // });

    // it('should initiate the voting countdown', async () => {
    //     const spy = jest.spyOn(GameThree.prototype as any, 'initiateCountdown');

    //     gameThree['sendPhotosToScreen']();
    //     expect(spy).toHaveBeenCalledTimes(1);
    //     expect(spy).toHaveBeenCalledWith(InitialParameters.COUNTDOWN_TIME_VOTE);
    // });

    // it('should set gameThreeGameState to Voting', async () => {
    //     gameThree['sendPhotosToScreen']();
    //     expect(gameThree['stageController'].stage).toBe(GameThreeGameState.Voting);
    // });
});
