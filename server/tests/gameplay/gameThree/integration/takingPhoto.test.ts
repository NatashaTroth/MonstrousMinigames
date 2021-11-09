import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhoto } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GameThreeEventMessage
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

    it('should emit the NewPhotoTopic event when the taking photo stage starts', async () => {
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

describe('Taking Photo', () => {
    beforeEach(() => {
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

    it('should allow client to send a photo within the countdown time', async () => {
        gameThree['handleInput'](message);
        expect(gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']].received).toBeTruthy();
        expect(gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']].url).toBe(mockPhotoUrl);
    });

    it('should have a gameThreeGameState of TakingPhoto after only one photo is sent', async () => {
        gameThree['handleInput'](message);
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.TakingPhoto);
    });

    it('should not have received all photos when only one is sent', async () => {
        gameThree['handleInput'](message);
        expect(gameThree['allPhotosReceived']()).toBeFalsy();
    });

    it('should have received all photos when all photos have been sent', async () => {
        users.forEach(user => {
            gameThree['handleInput']({ ...message, userId: user.id });
        });

        expect(gameThree['allPhotosReceived']()).toBeTruthy();
    });

    it('should change state to Voting when all photos have been received', async () => {
        users.forEach(user => {
            gameThree['handleInput']({ ...message, userId: user.id });
        });
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.Voting);
    });

    it('should stop the countdown when all photos have been received', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'stopCountdown');
        users.forEach(user => {
            gameThree['handleInput']({ ...message, userId: user.id });
        });
        expect(spy).toBeCalledTimes(1);
    });

    it('should change state to Voting when countdown runs out', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.Voting);
    });

    it('should not accept new photos when time has run out', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        gameThree['handleInput'](message);
        expect(gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']].received).toBeFalsy();
        expect(gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']].url).toBe('');
    });
});
