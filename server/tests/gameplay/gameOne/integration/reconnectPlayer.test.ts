import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { PlayerRank } from '../../../../src/gameplay/gameOne/interfaces';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId, users } from '../../mockData';
import { finishPlayer } from './gameOneHelperFunctions';

let gameOne: GameOne;
let gameEventEmitter: GameEventEmitter;

describe('Reconnect Player tests', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.gameState = GameState.Started;
    });

    it('should not finish game until reconnected player is finished', async () => {
        // finish game
        gameOne.disconnectPlayer('3');
        gameOne.disconnectPlayer('4');
        finishPlayer(gameOne, '1');
        gameOne.reconnectPlayer('4');
        finishPlayer(gameOne, '2');

        expect(gameOne.gameState).toBe(GameState.Started);
        finishPlayer(gameOne, '4');
        expect(gameOne.gameState).toBe(GameState.Finished);
    });

    it('should emit isActive is true when a player was reconnected and the game has finished', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);

        let eventData = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [] as PlayerRank[],
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message.data as any;
            }
        });
        // finish game
        Date.now = jest.fn(() => dateNow + 10000);
        gameOne.disconnectPlayer('3');
        gameOne.disconnectPlayer('4');
        finishPlayer(gameOne, '1');
        gameOne.reconnectPlayer('4');
        finishPlayer(gameOne, '2');
        finishPlayer(gameOne, '4');

        expect(eventData.playerRanks[0].isActive).toBeTruthy();
        expect(eventData.playerRanks[1].isActive).toBeTruthy();
        expect(eventData.playerRanks[2].isActive).toBeFalsy();
        expect(eventData.playerRanks[3].isActive).toBeTruthy();
    });
});
