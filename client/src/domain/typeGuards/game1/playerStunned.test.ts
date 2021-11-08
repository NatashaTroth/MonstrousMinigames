import { MessageTypesGame1 } from '../../../utils/constants';
import { PlayerStunnedMessage, playerStunnedTypeGuard } from './playerStunned';

describe('playerStunned TypeGuard', () => {
    it('when type is playerStunned, it should return true', () => {
        const data: PlayerStunnedMessage = {
            type: MessageTypesGame1.playerStunned,
        };

        expect(playerStunnedTypeGuard(data)).toEqual(true);
    });
});
