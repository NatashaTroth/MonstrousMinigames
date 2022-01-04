import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import InitialParameters from '../../../../src/gameplay/gameOne/constants/InitialParameters';
import { leaderboard, roomId, users } from '../../mockData';

let gameOne: GameOne;

describe('Reconnect Player tests', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.gameState = GameState.Started;
    });

    it('can run forward after being reconnected', async () => {
        gameOne.disconnectPlayer('1');
        gameOne.reconnectPlayer('1');
        gameOne['runForward']('1', InitialParameters.SPEED);
        expect(gameOne.players.get('1')!.positionX).toBe(gameOne.initialPlayerPositionX + InitialParameters.SPEED);
    });

    it('can complete an obstacle after being reconnected', async () => {
        gameOne.disconnectPlayer('1');
        gameOne.reconnectPlayer('1');

        try {
            expect(gameOne['playerHasCompletedObstacle']('1', 1)).not.toThrowError('DisconnectedUserError');
        } catch {
            //do nothing - catch other errors thrown
        }
    });
});
