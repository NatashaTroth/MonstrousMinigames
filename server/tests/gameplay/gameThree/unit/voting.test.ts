import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { IMessagePhotoVote } from '../../../../src/gameplay/gameThree/interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS, GameThreeEventMessage, PhotoVotingResults
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;
const message: IMessagePhotoVote = {
    type: GameThreeMessageTypes.PHOTO,
    voterId: users[0].id,
    photographerId: users[1].id,
};

describe('Handle Received Photo Vote', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        gameThree['gameThreeGameState'] = GameThreeGameState.Voting;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should set the voter's voted property to true", async () => {
        gameThree['handleReceivedPhotoVote'](message);
        expect(gameThree.players.get(message.voterId)!.roundInfo[gameThree['roundIdx']].voted).toBeTruthy();
    });

    it('should add the points to the player', async () => {
        const currentPoints = gameThree.players.get(message.photographerId)!.roundInfo[gameThree['roundIdx']].points;
        gameThree['handleReceivedPhotoVote'](message);
        expect(gameThree.players.get(message.photographerId)!.roundInfo[gameThree['roundIdx']].points).toBe(
            currentPoints + 1
        );
    });

    it("should not set the voter's voted property to true, if gameThreeGameState is not Voting", async () => {
        gameThree['gameThreeGameState'] = GameThreeGameState.BeforeStart;
        gameThree['handleReceivedPhotoVote'](message);
        expect(gameThree.players.get(message.voterId)!.roundInfo[gameThree['roundIdx']].voted).toBeFalsy();
    });
});

describe('Remove voting points from players who did not participate this round', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should remove received voting points from players who did not take a photo', async () => {
        const playerRoundInfo = gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']];
        playerRoundInfo.points = 100;
        playerRoundInfo.received = false;
        playerRoundInfo.voted = true;
        gameThree['removeVotingPointsFromPlayersNoParticipation']();
        expect(playerRoundInfo.points).toBe(0);
    });

    it('should remove received voting points from all players who did not take a photo', async () => {
        const player1RoundInfo = gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']];
        player1RoundInfo.points = 100;
        player1RoundInfo.received = false;
        player1RoundInfo.voted = true;
        const player2RoundInfo = gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']];
        player2RoundInfo.points = 100;
        player2RoundInfo.received = false;
        player2RoundInfo.voted = true;
        gameThree['removeVotingPointsFromPlayersNoParticipation']();
        expect(player1RoundInfo.points).toBe(0);
        expect(player2RoundInfo.points).toBe(0);
    });

    it('should remove received voting points from players who did not vote', async () => {
        const playerRoundInfo = gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']];
        playerRoundInfo.points = 100;
        playerRoundInfo.received = true;
        playerRoundInfo.voted = false;
        gameThree['removeVotingPointsFromPlayersNoParticipation']();
        expect(playerRoundInfo.points).toBe(0);
    });

    it('should remove received voting points from all players who did not vote', async () => {
        const player1RoundInfo = gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']];
        player1RoundInfo.points = 100;
        player1RoundInfo.received = true;
        player1RoundInfo.voted = false;
        const player2RoundInfo = gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']];
        player2RoundInfo.points = 100;
        player2RoundInfo.received = true;
        player2RoundInfo.voted = false;
        gameThree['removeVotingPointsFromPlayersNoParticipation']();
        expect(player1RoundInfo.points).toBe(0);
        expect(player2RoundInfo.points).toBe(0);
    });

    it('should remove received voting points from all players who did not take a photo or vote', async () => {
        const player1RoundInfo = gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']];
        player1RoundInfo.points = 100;
        player1RoundInfo.received = false;
        player1RoundInfo.voted = false;
        const player2RoundInfo = gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']];
        player2RoundInfo.points = 100;
        player2RoundInfo.received = false;
        player2RoundInfo.voted = false;
        gameThree['removeVotingPointsFromPlayersNoParticipation']();
        expect(player1RoundInfo.points).toBe(0);
        expect(player2RoundInfo.points).toBe(0);
    });
});

describe('All votes received', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when all players have voted', async () => {
        Array.from(gameThree.players.values()).forEach(player => {
            player.roundInfo[gameThree['roundIdx']].voted = true;
        });

        expect(gameThree['allVotesReceived']()).toBeTruthy();
    });

    it('should return false when not all players have voted', async () => {
        const otherPlayers = Array.from(gameThree.players.values()).filter(player => player.id !== users[0].id);
        otherPlayers.forEach(player => {
            player.roundInfo[gameThree['roundIdx']].voted = true;
        });

        expect(gameThree['allVotesReceived']()).toBeFalsy();
    });
});

let gameEventEmitter: GameEventEmitter;
describe('Send Photos to screen', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    it('should emit a photoVotingResults', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventCalled = true;
            }
        });

        gameThree['sendPhotoVotingResultsToScreen']();
        expect(eventCalled).toBeTruthy();
    });

    it('should return the correct votingResults', async () => {
        let eventData: undefined | PhotoVotingResults;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventData = message;
            }
        });

        const points: number[] = [];
        Array.from(gameThree.players.values()).forEach((player, idx) => {
            player.roundInfo[gameThree['roundIdx']].points = idx;
            points.push(idx);
        });

        gameThree['sendPhotoVotingResultsToScreen']();
        expect(eventData?.results.map(result => result.points)).toEqual(expect.arrayContaining(points));
    });

    it('should return the correct photographer ids', async () => {
        let eventData: undefined | PhotoVotingResults;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS) {
                eventData = message;
            }
        });

        const photographerIds: string[] = [];
        Array.from(gameThree.players.values()).forEach((player, idx) => {
            photographerIds[idx] = player.id;
        });

        gameThree['sendPhotoVotingResultsToScreen']();
        expect(eventData?.results.map(result => result.photographerId)).toEqual(
            expect.arrayContaining(photographerIds)
        );
    });

    it('should initiate the viewing results countdown', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'initiateCountdown');

        gameThree['sendPhotoVotingResultsToScreen']();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
    });

    it('should set gameThreeGameState to ViewingResults', async () => {
        gameThree['sendPhotoVotingResultsToScreen']();
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.ViewingResults);
    });
});
