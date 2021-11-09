import {
    PhaserLoadingTimedOutMessage,
    phaserLoadingTimedOutTypeGuard,
} from '../../domain/typeGuards/game1/phaserLoadingTimedOut';
import { MessageTypesGame1 } from '../../utils/constants';

describe('paused TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: PhaserLoadingTimedOutMessage = {
            type: MessageTypesGame1.phaserLoadingTimedOut,
        };

        expect(phaserLoadingTimedOutTypeGuard(data)).toEqual(true);
    });
});
