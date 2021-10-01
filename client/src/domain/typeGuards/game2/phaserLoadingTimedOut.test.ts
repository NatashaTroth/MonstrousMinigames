import { MessageTypesGame2 } from '../../../utils/constants';
import { PhaserLoadingTimedOutMessage, phaserLoadingTimedOutTypeGuard } from './phaserLoadingTimedOut';

describe('sheep paused TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: PhaserLoadingTimedOutMessage = {
            type: MessageTypesGame2.phaserLoadingTimedOut,
        };

        expect(phaserLoadingTimedOutTypeGuard(data)).toEqual(true);
    });
});
