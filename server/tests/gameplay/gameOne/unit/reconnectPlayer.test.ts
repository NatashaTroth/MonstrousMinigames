import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
<<<<<<< HEAD
import InitialParameters from '../../../../src/gameplay/gameOne/constants/InitialParameters';
import GameOnePlayer from '../../../../src/gameplay/gameOne/GameOnePlayer';
=======
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
>>>>>>> dev
import { leaderboard, roomId, users } from '../../mockData';
import { playerHasCompletedObstacleMessage, players, runForwardMessage } from '../gameOneMockData';

let gameOne: GameOne;
const InitialGameParameters = getInitialParams();

describe('Reconnect Player tests', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
        gameOne.gameState = GameState.Started;
    });

    it('can run forward after being reconnected', async () => {
        const initialPlayerPositionX = InitialParameters.PLAYERS_POSITION_X;
        gameOne.disconnectPlayer('1');
        gameOne.reconnectPlayer('1');
        gameOne.receiveInput(runForwardMessage);
        expect(gameOne.players.get('1')!.positionX).toBe(initialPlayerPositionX + InitialParameters.SPEED);
    });

    it('can complete an obstacle after being reconnected', async () => {
        gameOne.disconnectPlayer('1');
        gameOne.reconnectPlayer('1');
        expect(() => gameOne.receiveInput(playerHasCompletedObstacleMessage)).not.toThrowError('DisconnectedUserError');
    });
});
