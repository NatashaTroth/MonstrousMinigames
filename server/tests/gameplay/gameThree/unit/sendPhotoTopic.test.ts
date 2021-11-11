import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { Countdown } from '../../../../src/gameplay/gameThree/classes/Countdown';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GameThreeEventMessage
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Send Photo Topic', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should change the gameThreeGameState to TakingPhoto', async () => {
        gameThree['sendPhotoTopic']();
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.TakingPhoto);
    });

    it('should call initiateCountdown with the take photo time', async () => {
        const spy = jest.spyOn(Countdown.prototype as any, 'initiateCountdown').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree['sendPhotoTopic']();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
    });

    it('should emit a NewTopic event', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC) {
                eventCalled = true;
            }
        });
        gameThree['sendPhotoTopic']();
        expect(eventCalled).toBeTruthy();
    });
});
