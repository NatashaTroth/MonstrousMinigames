import { PlayerUnstunnedMessage, playerUnstunnedTypeGuard } from '../../../domain/typeGuards/game1/playerUnstunned';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('playerUnstunned TypeGuard', () => {
    it('when type is playerUnstunned, it should return true', () => {
        const data: PlayerUnstunnedMessage = {
            type: MessageTypesGame1.playerUnstunned,
        };

        expect(playerUnstunnedTypeGuard(data)).toEqual(true);
    });
});
