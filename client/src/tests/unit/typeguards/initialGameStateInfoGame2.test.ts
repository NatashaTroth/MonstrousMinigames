import {
    InitialGameStateInfoMessage,
    initialGameStateInfoTypeGuard,
} from '../../../domain/typeGuards/game2/initialGameStateInfo';
import { GameState, MessageTypesGame2 } from '../../../utils/constants';

describe('initial sheep game state info TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: InitialGameStateInfoMessage = {
            type: MessageTypesGame2.initialGameState,
            data: {
                roomId: 'xxx',
                playersState: [],
                gameState: GameState.started,
                sheep: [],
                lengthX: 0,
                lengthY: 0,
                brightness: 100,
            },
        };

        expect(initialGameStateInfoTypeGuard(data)).toEqual(true);
    });
});
