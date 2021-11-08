import { GameState, MessageTypesGame1 } from '../../../utils/constants';
import { GameStateInfoMessage, gameStateInfoTypeGuard } from './gameStateInfo';

describe('game state info TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: GameStateInfoMessage = {
            type: MessageTypesGame1.gameState,
            data: {
                roomId: 'xxx',
                playersState: [],
                chasersPositionX: 0,
                gameState: GameState.started,
                trackLength: 2000,
                numberOfObstacles: 4,
                cameraPositionX: 0,
            },

            // },
        };

        expect(gameStateInfoTypeGuard(data)).toEqual(true);
    });
});
