import {
    PhaserLoadingTimedOutMessage,
    phaserLoadingTimedOutTypeGuard,
} from '../../domain/typeGuards/game2/phaserLoadingTimedOut';
import { MessageTypesGame2 } from '../../utils/constants';

describe('sheep paused TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: PhaserLoadingTimedOutMessage = {
            type: MessageTypesGame2.phaserLoadingTimedOut,
        };

        expect(phaserLoadingTimedOutTypeGuard(data)).toEqual(true);
    });
});
