import { GameHasResetMessage, resetTypeGuard } from '../../domain/typeGuards/reset';
import { MessageTypes } from '../../utils/constants';

describe('reset TypeGuard', () => {
    it('when type is reset, it should return true', () => {
        const data: GameHasResetMessage = {
            type: MessageTypes.gameHasReset,
        };

        expect(resetTypeGuard(data)).toEqual(true);
    });
});
