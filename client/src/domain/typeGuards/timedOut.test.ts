import { MessageTypes } from '../../utils/constants';
import { TimedOutMessage, timedOutTypeGuard } from './timedOut';

describe('timedOut TypeGuard', () => {
    it('when type is timedOut, it should return true', () => {
        const data: TimedOutMessage = {
            type: MessageTypes.gameHasTimedOut,
            rank: 1,
        };

        expect(timedOutTypeGuard(data)).toEqual(true);
    });
});
