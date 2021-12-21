import { GameStateInfoMessage, gameStateInfoTypeGuard } from '../../domain/typeGuards/game2/gameStateInfo';
import { GameState, MessageTypesGame2 } from '../../utils/constants';

describe('sheep game state info TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: GameStateInfoMessage = {
            type: MessageTypesGame2.gameState,
            data: {
                roomId: 'xxx',
                playersState: [],
                gameState: GameState.started,
                sheep: [],
                lengthX: 0,
                lengthY: 0,
            },

            // },
        };

        expect(gameStateInfoTypeGuard(data)).toEqual(true);
    });
});
