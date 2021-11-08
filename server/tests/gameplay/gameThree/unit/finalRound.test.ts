import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN, GameThreeEventMessage,
    TakeFinalPhotosCountdown
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { leaderboard, roomId } from '../../mockData';

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
});
