import { StartPhaserGameMessage, startPhaserGameTypeGuard } from '../../domain/typeGuards/startPhaserGame';
import { MessageTypesGame1 } from '../../utils/constants';

describe('startPhaserGame TypeGuard', () => {
    it('when type is startPhaserGame, it should return true', () => {
        const data: StartPhaserGameMessage = {
            type: MessageTypesGame1.startPhaserGame,
        };

        expect(startPhaserGameTypeGuard(data)).toEqual(true);
    });
});
