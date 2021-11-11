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
    GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN, GameThreeEventMessage
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

const mockPhotoUrl = 'https://mockPhoto.com';
const message: IMessagePhoto = { type: GameThreeMessageTypes.PHOTO, url: mockPhotoUrl, userId: users[0].id };

describe('Initiate stage', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
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

    it('should emit the NewPhotoTopic event when the taking final photo stage starts', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN) {
                eventCalled = true;
            }
        });
        gameThree['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['handleNewRound']();
        expect(eventCalled).toBeTruthy();
    });
});

describe('Taking Final Photos', () => {
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        gameThree['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['handleNewRound']();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should allow client to send a photo within the countdown time', async () => {
        gameThree['handleInput'](message);
        expect(gameThree.players.get(users[0].id)!.finalRoundInfo.urls.length).toBe(1);
    });

    it('should increase final points by 1 when photo received', async () => {
        const initialFinalPoints = gameThree.players.get(users[0].id)!.finalRoundInfo.points;
        gameThree['handleInput'](message);
        expect(gameThree.players.get(users[0].id)!.finalRoundInfo.points).toBe(initialFinalPoints + 1);
    });

    it('should update the urls length when multiple photos are sent', async () => {
        for (let i = 1; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
            gameThree['handleInput'](message);
        }
        expect(gameThree.players.get(users[0].id)!.finalRoundInfo.urls.length).toBe(2);
    });

    it('should not set received as true if not all photos have been received', async () => {
        for (let i = 1; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
            gameThree['handleInput'](message);
        }
        expect(gameThree.players.get(users[0].id)!.finalRoundInfo.received).toBeFalsy();
    });

    it('should set received as true when all photos have been received', async () => {
        for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
            gameThree['handleInput'](message);
        }
        expect(gameThree.players.get(users[0].id)!.finalRoundInfo.received).toBeTruthy();
    });

    it('should still have a gameThreeGameState of TakingFinalPhotos after only one player has sent all their photos', async () => {
        for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
            gameThree['handleInput'](message);
        }
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.TakingFinalPhotos);
    });

    it('should not have received all final photos when only one user has sent them', async () => {
        for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
            gameThree['handleInput'](message);
        }
        expect(gameThree['allFinalPhotosReceived']()).toBeFalsy();
    });

    it('should have received all photos when all photos have been sent', async () => {
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...message, userId: user.id });
            }
        });

        expect(gameThree['allFinalPhotosReceived']()).toBeTruthy();
    });

    it('should not accept any more photos when already received number of final photos', async () => {
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS + 1; i++) {
                gameThree['handleInput']({ ...message, userId: user.id });
            }
        });

        expect(gameThree.players.get(users[0].id)!.finalRoundInfo.urls.length).toBe(
            InitialParameters.NUMBER_FINAL_PHOTOS
        );
    });

    it('should not accept any more points when already received number of final photos', async () => {
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS + 1; i++) {
                gameThree['handleInput']({ ...message, userId: user.id });
            }
        });

        expect(gameThree.players.get(users[0].id)!.finalRoundInfo.points).toBe(InitialParameters.NUMBER_FINAL_PHOTOS);
    });

    it('should change state to PresentingFinalPhotos when all photos have been received', async () => {
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...message, userId: user.id });
            }
        });
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.PresentingFinalPhotos);
    });

    it('should stop the countdown when all photos have been received', async () => {
        const spy = jest.spyOn(Countdown.prototype as any, 'stopCountdown');
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...message, userId: user.id });
            }
        });
        expect(spy).toBeCalledTimes(1);
    });

    it('should change state to PresentingFinalPhotos when countdown runs out', async () => {
        for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
            gameThree['handleInput']({ ...message });
        }

        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS);
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.PresentingFinalPhotos);
    });

    it('should not accept new photos when time has run out', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS);
        gameThree['handleInput'](message);

        expect(gameThree.players.get(users[0].id)!.finalRoundInfo.urls.length).toBe(0);
    });
});
