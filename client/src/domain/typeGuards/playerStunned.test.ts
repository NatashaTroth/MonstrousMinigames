import { MessageTypes } from '../../utils/constants';
import { PlayerStunnedMessage, playerStunnedTypeGuard } from './playerStunned';

describe('playerStunned TypeGuard', () => {
    it('when type is playerStunned, it should return true', () => {
        const data: PlayerStunnedMessage = {
            type: MessageTypes.playerStunned,
            rank: 1,
        };

        expect(playerStunnedTypeGuard(data)).toEqual(true);
    });
});
