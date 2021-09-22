import { MessageTypes } from '../../utils/constants';
import { PhaserLoadingTimedOutMessage, phaserLoadingTimedOutTypeGuard } from './phaserLoadingTimedOut';

describe('paused TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: PhaserLoadingTimedOutMessage = {
            type: MessageTypes.phaserLoadingTimedOut,
        };

        expect(phaserLoadingTimedOutTypeGuard(data)).toEqual(true);
    });
});
