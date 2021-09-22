import { MessageTypes } from '../../utils/constants';
import { PlayerDiedMessage, playerDiedTypeGuard } from './playerDied';

describe('playerDied TypeGuard', () => {
    it('when type is playerDied, it should return true', () => {
        const data: PlayerDiedMessage = {
            type: MessageTypes.playerDied,
            rank: 1,
        };

        expect(playerDiedTypeGuard(data)).toEqual(true);
    });
});
