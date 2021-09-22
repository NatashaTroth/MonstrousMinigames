import { GameState, MessageTypes } from '../../utils/constants';
import { InitialGameStateInfoMessage, initialGameStateInfoTypeGuard } from './initialGameStateInfo';

describe('initial game state info TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: InitialGameStateInfoMessage = {
            type: MessageTypes.initialGameState,
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

        expect(initialGameStateInfoTypeGuard(data)).toEqual(true);
    });
});
