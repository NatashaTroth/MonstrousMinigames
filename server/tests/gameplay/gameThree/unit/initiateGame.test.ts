import 'reflect-metadata';

import { GameNames } from '../../../../src/enums/gameNames';
import { GameThree } from '../../../../src/gameplay';
// import {
//     RandomWordGenerator
// } from '../../../../src/gameplay/gameThree/classes/RandomWordGenerator';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;

describe('Change and verify game state', () => {
    beforeEach(async () => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    it('initiates gameStartedTime with 0', async () => {
        expect(gameThree['_gameStartedAt']).toBe(0);
    });

    it('initiates numberRounds with correct value', async () => {
        expect(gameThree['numberRounds']).toBe(InitialParameters.NUMBER_ROUNDS);
    });

    // it('initiates randomWordGenerator with new RandomWordGenerator instance', async () => {
    //     expect(gameThree['randomWordGenerator']).toBeInstanceOf(RandomWordGenerator);
    // });

    it('initiates gameThreeGameState with BeforeStart value', async () => {
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.BeforeStart);
    });

    // it('initiates countdownTimeLeft with 0', async () => {
    //     expect(gameThree['countdownTimeLeft']).toBe(0);
    // });

    // it('initiates countdownRunning with false', async () => {
    //     expect(gameThree['countdownRunning']).toBeFalsy();
    // });

    it('initiates roundIdx with -1', async () => {
        expect(gameThree['roundIdx']).toBe(-1);
    });

    it('initiates gameName with Game3', async () => {
        expect(gameThree['gameName']).toBe(GameNames.GAME3);
    });

    it('initiates roomId with correct value', async () => {
        expect(gameThree['roomId']).toBe(roomId);
    });

    it('initiates sendGameStateUpdates with false', async () => {
        expect(gameThree['sendGameStateUpdates']).toBeFalsy();
    });
});
