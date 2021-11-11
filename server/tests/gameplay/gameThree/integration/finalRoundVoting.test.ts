import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameState } from '../../../../src/gameplay/enums';
import { Countdown } from '../../../../src/gameplay/gameThree/classes/Countdown';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhoto, IMessagePhotoVote } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS, GameThreeEventMessage
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

const mockPhotoUrl = 'https://mockPhoto.com';
const photoMessage: IMessagePhoto = { type: GameThreeMessageTypes.PHOTO, url: mockPhotoUrl, userId: users[0].id };

const votingMessage: IMessagePhotoVote = {
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
        gameThree['stageController']['_roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['stageController'].handleNewRound();
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...photoMessage, userId: user.id });
            }
        });
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the VoteForPhotos event when the voting stage starts', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS) {
                eventCalled = true;
            }
        });

        const numberPresentations = Array.from(gameThree.players.values()).filter(
            player => player.finalRoundInfo.received
        ).length;
        for (let i = 0; i < numberPresentations; i++) {
            advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
        }

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
        gameThree['stageController']['_roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['stageController'].handleNewRound();
        users.forEach(user => {
            for (let i = 0; i < InitialParameters.NUMBER_FINAL_PHOTOS; i++) {
                gameThree['handleInput']({ ...photoMessage, userId: user.id });
            }
        });
        const numberPresentations = Array.from(gameThree.players.values()).filter(
            player => player.finalRoundInfo.received
        ).length;
        for (let i = 0; i < numberPresentations; i++) {
            advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
        }
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should allow client to send a vote within the countdown time', async () => {
        gameThree['handleInput'](votingMessage);
        expect(gameThree.players.get(votingMessage.voterId)!.finalRoundInfo.voted).toBeTruthy();
    });

    it('should have a gameThreeGameState of FinalVoting after only one vote is sent', async () => {
        gameThree['handleInput'](votingMessage);
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.FinalVoting);
    });

    it('should not have received all votes when only one is sent', async () => {
        gameThree['handleInput'](votingMessage);
        expect(gameThree['allFinalVotesReceived']()).toBeFalsy();
    });

    it('should have received all votes when all votes have been sent', async () => {
        receiveAllVotes();
        expect(gameThree['allFinalVotesReceived']()).toBeTruthy();
    });

    it('should change state to ViewingFinalResults when all votes have been received', async () => {
        receiveAllVotes();
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.ViewingFinalResults);
    });

    it('should change game state to Finished when all votes have been received', async () => {
        receiveAllVotes();
        expect(gameThree.gameState).toBe(GameState.Finished);
    });

    it('should stop the countdown when all votes have been received', async () => {
        const spy = jest.spyOn(Countdown.prototype as any, 'stopCountdown');
        receiveAllVotes();
        expect(spy).toBeCalledTimes(1);
    });

    it('should change state to ViewingFinalResults when countdown runs out', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(gameThree['stageController'].stage).toBe(GameThreeGameState.ViewingFinalResults);
    });

    it('should change game state to Finished when countdown runs out', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(gameThree.gameState).toBe(GameState.Finished);
    });

    it('should not accept new votes when time has run out', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        gameThree['handleInput'](votingMessage);
        expect(gameThree.players.get(votingMessage.voterId)!.finalRoundInfo.voted).toBeFalsy();
    });

    it.todo('test points');
});

function receiveAllVotes() {
    users.forEach((user, idx) => {
        const newMessage = { ...votingMessage };
        newMessage.voterId = user.id;
        newMessage.photographerId = users[(idx + 1) % users.length].id;
        gameThree['handleInput']({ ...newMessage });
    });
}
