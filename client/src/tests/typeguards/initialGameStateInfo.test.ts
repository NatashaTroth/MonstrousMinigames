import {
    InitialGameStateInfoMessage,
    initialGameStateInfoTypeGuard,
} from '../../domain/typeGuards/game1/initialGameStateInfo';
import { GameState, MessageTypesGame1 } from '../../utils/constants';

describe('initial game state info TypeGuard', () => {
    it('when type is initial game state, it should return true', () => {
        const data: InitialGameStateInfoMessage = {
            type: MessageTypesGame1.initialGameState,
            data: {
                roomId: 'xxx',
                playersState: [],
                chasersPositionX: 0,
                gameState: GameState.started,
                trackLength: 2000,
                numberOfObstacles: 4,
                cameraPositionX: 0,
            },
        };

        expect(initialGameStateInfoTypeGuard(data)).toEqual(true);
    });
});
