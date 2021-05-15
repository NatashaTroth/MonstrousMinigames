import { MessageTypes } from '../../utils/constants';
import { GameHasPausedMessage, pausedTypeGuard } from './paused';

describe('paused TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: GameHasPausedMessage = {
            type: MessageTypes.gameHasPaused,
        };

        expect(pausedTypeGuard(data)).toEqual(true);
    });
});
