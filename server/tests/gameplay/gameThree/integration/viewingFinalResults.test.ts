import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameState } from '../../../../src/gameplay/enums';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
// import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState'; //TODO test
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhoto } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage, GlobalGameHasFinished
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

const mockPhotoUrl = 'https://mockPhoto.com';
const photoMessage: IMessagePhoto = { type: GameThreeMessageTypes.PHOTO, url: mockPhotoUrl, userId: users[0].id };

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
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        gameThree['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['handleNewRound']();
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

    it('should emit the GameHasFinished event when voting is over', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventCalled = true;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(eventCalled).toBeTruthy();
    });
});

describe('Final results', () => {
    let eventData: GlobalGameHasFinished = {
        type: GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED,
        roomId: 'xxx',
        data: {
            roomId: 'xx',
            gameState: GameState.Finished,
            playerRanks: [],
        },
    };
    const pointsArray: number[] = [];

    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        gameThree['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1;
        gameThree['handleNewRound']();
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
        // add points
        Array.from(gameThree.players.values()).forEach((player, idx) => {
            pointsArray.push(player.getTotalPoints()); // get points from before (from sending final photo)
            for (let i = 0; i < InitialParameters.NUMBER_ROUNDS - 1; i++) {
                player.addPoints(1, idx);
                pointsArray[idx] += idx;
            }
            player.addPointsFinalRound(idx);
            pointsArray[idx] += idx;
        });

        // get final results
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message;
            }
        });
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should emit the points sorted in descending order', async () => {
        expect(eventData.data.playerRanks.map(result => result.points)).toStrictEqual(
            pointsArray.sort((a, b) => b - a)
        );
    });

    it('should emit the points sorted in descending order (0 and 1st place)', async () => {
        expect(eventData.data.playerRanks[0].points).toBeGreaterThanOrEqual(eventData.data.playerRanks[1].points);
    });

    it('should emit the points sorted in descending order (1st and 2nd place)', async () => {
        expect(eventData.data.playerRanks[1].points).toBeGreaterThanOrEqual(eventData.data.playerRanks[2].points);
    });

    it('should emit the points sorted in descending order (2nd and 3rd place)', async () => {
        expect(eventData.data.playerRanks[2].points).toBeGreaterThanOrEqual(eventData.data.playerRanks[3].points);
    });

    it('should emit the points sorted in descending order (2nd and 3rd place)', async () => {
        expect(eventData.data.playerRanks[2].points).toBeGreaterThanOrEqual(eventData.data.playerRanks[3].points);
    });

    it('should emit the rank 1', async () => {
        expect(eventData.data.playerRanks[0].rank).toBe(1);
    });

    it('should emit the rank 2', async () => {
        expect(eventData.data.playerRanks[1].rank).toBe(2);
    });

    it('should emit the rank 3', async () => {
        expect(eventData.data.playerRanks[2].rank).toBe(3);
    });

    it('should emit the rank 4', async () => {
        expect(eventData.data.playerRanks[3].rank).toBe(4);
    });

    it.todo('test points better - just done for quickness here. also test when the same amount of points same rank');
});
