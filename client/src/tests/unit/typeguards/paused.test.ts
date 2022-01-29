import { GameHasPausedMessage, pausedTypeGuard } from '../../../domain/typeGuards/paused';
import { MessageTypes } from '../../../utils/constants';

describe('paused TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: GameHasPausedMessage = {
            type: MessageTypes.gameHasPaused,
        };

        expect(pausedTypeGuard(data)).toEqual(true);
    });
});
