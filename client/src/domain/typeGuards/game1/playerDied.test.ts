import { MessageTypesGame1 } from '../../../utils/constants';
import { PlayerDiedMessage, playerDiedTypeGuard } from './playerDied';

describe('playerDied TypeGuard', () => {
    it('when type is playerDied, it should return true', () => {
        const data: PlayerDiedMessage = {
            type: MessageTypesGame1.playerDied,
            rank: 1,
        };

        expect(playerDiedTypeGuard(data)).toEqual(true);
    });
});
