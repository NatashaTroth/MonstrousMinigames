import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GAME_THREE_EVENT_MESSAGE__NEW_ROUND, GameThreeEventMessage
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Handle new round', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should increase the roundIdx', async () => {
        const roundIdx = gameThree['stageController']['_roundIdx'];

        gameThree['stageController'].handleNewRound();
        expect(gameThree['stageController']['_roundIdx']).toBe(roundIdx + 1);
    });

    it('should call sendPhotoTopic when it is not the final round and photoTopics is not empty', async () => {
        gameThree['stageController']['_roundIdx'] = 0;
        // gameThree.photoTopics.topics = ['cat', 'dog'];
        const spy = jest.spyOn(GameThree.prototype as any, 'sendPhotoTopic');

        gameThree['stageController'].handleNewRound();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call sendTakeFinalPhotosCountdown when it is the final round', async () => {
        gameThree['stageController']['_roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        const spy = jest.spyOn(GameThree.prototype as any, 'sendTakeFinalPhotosCountdown');

        gameThree['stageController'].handleNewRound();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call sendTakeFinalPhotosCountdown when photoTopics is empty', async () => {
        gameThree['stageController']['_roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        const spy = jest.spyOn(GameThree.prototype as any, 'sendTakeFinalPhotosCountdown');

        gameThree['stageController'].handleNewRound();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit a NewRoundEvent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__NEW_ROUND) {
                eventCalled = true;
            }
        });

        gameThree['stageController'].handleNewRound();
        expect(eventCalled).toBeTruthy();
    });
});

describe('Is final round', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when it is the final round', async () => {
        gameThree['stageController']['_roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['stageController'].handleNewRound();
        expect(gameThree['stageController']['isFinalRound']()).toBeTruthy();
    });

    it('should return false when it is the final round', async () => {
        gameThree['stageController']['_roundIdx'] = 0;
        expect(gameThree['stageController']['isFinalRound']()).toBeFalsy();
    });
});
