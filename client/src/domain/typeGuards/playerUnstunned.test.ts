import { MessageTypes } from '../../utils/constants';
import { PlayerUnstunnedMessage, playerUnstunnedTypeGuard } from './playerUnstunned';

describe('playerUnstunned TypeGuard', () => {
    it('when type is playerUnstunned, it should return true', () => {
        const data: PlayerUnstunnedMessage = {
            type: MessageTypes.playerUnstunned,
        };

        expect(playerUnstunnedTypeGuard(data)).toEqual(true);
    });
});
