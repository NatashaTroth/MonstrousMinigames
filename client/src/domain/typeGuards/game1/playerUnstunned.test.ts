import { MessageTypesGame1 } from '../../../utils/constants';
import { PlayerUnstunnedMessage, playerUnstunnedTypeGuard } from './playerUnstunned';

describe('playerUnstunned TypeGuard', () => {
    it('when type is playerUnstunned, it should return true', () => {
        const data: PlayerUnstunnedMessage = {
            type: MessageTypesGame1.playerUnstunned,
        };

        expect(playerUnstunnedTypeGuard(data)).toEqual(true);
    });
});
