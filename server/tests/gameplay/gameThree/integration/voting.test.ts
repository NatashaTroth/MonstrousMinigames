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
import { IMessagePhotoVote } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS, GameThreeEventMessage
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

const message: IMessagePhotoVote = {
    type: GameThreeMessageTypes.PHOTO_VOTE,
    voterId: users[0].id,
    photographerId: users[1].id,
};

describe('Initiate stage', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
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

    it('should emit the VoteForPhotos event when the voting stage starts', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS) {
                eventCalled = true;
            }
        });

        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        expect(eventCalled).toBeTruthy();
    });
});

describe('Voting stage', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should allow client to send a vote within the countdown time', async () => {
        gameThree['handleInput'](message);
        expect(
            gameThree.players.get(users[0].id)!.roundInfo[gameThree['stageController']['_roundIdx']].voted
        ).toBeTruthy();
    });

    it('should have a gameThreeGameState of Voting after only one vote is sent', async () => {
        gameThree['handleInput'](message);
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.Voting);
    });

    it('should not have received all votes when only one is sent', async () => {
        gameThree['handleInput'](message);
        expect(gameThree['allVotesReceived']()).toBeFalsy();
    });

    it('should have received all votes when all votes have been sent', async () => {
        receiveAllVotes();
        expect(gameThree['allVotesReceived']()).toBeTruthy();
    });

    it('should change state to ViewingResults when all votes have been received', async () => {
        receiveAllVotes();
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.ViewingResults);
    });

    it('should stop the countdown when all votes have been received', async () => {
        const spy = jest.spyOn(Countdown.prototype as any, 'stopCountdown');
        receiveAllVotes();
        expect(spy).toBeCalledTimes(1);
    });

    it('should change state to ViewingResults when countdown runs out', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.ViewingResults);
    });

    it('should not accept new votes when time has run out', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        gameThree['handleInput'](message);
        expect(
            gameThree.players.get(users[0].id)!.roundInfo[gameThree['stageController']['_roundIdx']].voted
        ).toBeFalsy();
    });

    it.todo('test points');
});

function receiveAllVotes() {
    users.forEach((user, idx) => {
        const newMessage = { ...message };
        newMessage.voterId = user.id;
        newMessage.photographerId = users[(idx + 1) % users.length].id;
        gameThree['handleInput']({ ...newMessage });
    });
}
