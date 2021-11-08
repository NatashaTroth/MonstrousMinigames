import { MessageTypesGame1 } from '../../utils/constants';
import { StartPhaserGameMessage, startPhaserGameTypeGuard } from './startPhaserGame';

describe('startPhaserGame TypeGuard', () => {
    it('when type is started, it should return true', () => {
        const data: StartPhaserGameMessage = {
            type: MessageTypesGame1.startPhaserGame,
        };

        expect(startPhaserGameTypeGuard(data)).toEqual(true);
    });
});
