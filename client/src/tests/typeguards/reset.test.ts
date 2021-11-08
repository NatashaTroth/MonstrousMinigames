import { MessageTypes } from '../../utils/constants';
import { GameHasResetMessage, resetTypeGuard } from './reset';

describe('reset TypeGuard', () => {
    it('when type is reset, it should return true', () => {
        const data: GameHasResetMessage = {
            type: MessageTypes.gameHasReset,
        };

        expect(resetTypeGuard(data)).toEqual(true);
    });
});
