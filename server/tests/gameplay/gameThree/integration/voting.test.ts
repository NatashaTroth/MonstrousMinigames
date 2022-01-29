import 'reflect-metadata';

import { container } from 'tsyringe';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhotoVote } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS, GameThreeEventMessage, PhotoVotingResults
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';
import { receiveMultiplePhotos, votingMessage } from '../gameThreeMockData';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Voting stage', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    afterAll(() => {
        container.resolve(GameEventEmitter).cleanUpListeners();
    });

    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        receiveMultiplePhotos(gameThree);
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
    });

    afterEach(() => {
        gameEventEmitter.removeAllListeners();
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should not emit the Viewing Results event when only one vote is sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventCalled = true;
            }
        });
        gameThree.receiveInput(votingMessage);
        expect(eventCalled).toBeFalsy();
    });

    it('should emit the Viewing Results event when all votes were sent', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventCalled = true;
            }
        });

        receiveAllVotes();
        expect(eventCalled).toBeTruthy();
    });

    it('should not emit the View Results event when voting countdown has not run out', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE - 1);
        expect(eventCalled).toBeFalsy();
    });

    it('should emit the View Results event when voting countdown runs out', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventCalled).toBeTruthy();
    });
});

describe('Results', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    afterAll(() => {
        container.resolve(GameEventEmitter).cleanUpListeners();
    });

    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        receiveMultiplePhotos(gameThree);
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
    });

    afterEach(() => {
        gameEventEmitter.removeAllListeners();
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should add a point to the photographerId when a vote was received', async () => {
        let eventData: undefined | PhotoVotingResults;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventData = message;
            }
        });
        const msg: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId: users[0].id,
            photographerId: users[1].id,
        };
        gameThree.receiveInput(msg);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventData?.results.length).toBe(1);
        expect(eventData?.results.find(result => result.photographerId === users[1].id)?.votes).toBe(1);
    });

    it('should add a point per vote to the photographerId when a vote was received', async () => {
        let eventData: undefined | PhotoVotingResults;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventData = message;
            }
        });
        const msg: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId: users[0].id,
            photographerId: users[1].id,
        };
        gameThree.receiveInput(msg);
        msg.voterId = users[2].id;
        gameThree.receiveInput(msg);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventData?.results.length).toBe(1);
        expect(eventData?.results.find(result => result.photographerId === users[1].id)?.votes).toBe(2);
    });

    it('should add a point per vote to the photographerId when a vote was received', async () => {
        let eventData: undefined | PhotoVotingResults;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventData = message;
            }
        });
        const msg: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId: users[0].id,
            photographerId: users[1].id,
        };
        gameThree.receiveInput(msg);
        msg.voterId = users[2].id;
        gameThree.receiveInput(msg);
        msg.voterId = users[1].id;
        msg.photographerId = users[2].id;
        gameThree.receiveInput(msg);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventData?.results.length).toBe(2);
        expect(eventData?.results.find(result => result.photographerId === users[2].id)?.votes).toBe(1);
    });

    it('should not add a point to the photographerId from non existent voterId', async () => {
        let eventData: undefined | PhotoVotingResults;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventData = message;
            }
        });
        const msg: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId: 'xxxxx',
            photographerId: users[1].id,
        };
        gameThree.receiveInput(msg);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventData?.results.length).toBe(0);
    });

    it('should not add a point to a non existent photographerId ', async () => {
        let eventData: undefined | PhotoVotingResults;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventData = message;
            }
        });
        const msg: IMessagePhotoVote = {
            type: GameThreeMessageTypes.PHOTO_VOTE,
            voterId: users[0].id,
            photographerId: 'xxxxx',
        };
        gameThree.receiveInput(msg);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventData?.results.length).toBe(0);
    });
});

function receiveAllVotes() {
    users.forEach((user, idx) => {
        const newMessage = { ...votingMessage };
        newMessage.voterId = user.id;
        newMessage.photographerId = users[(idx + 1) % users.length].id;
        gameThree.receiveInput({ ...newMessage });
    });
}
