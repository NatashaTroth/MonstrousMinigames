import {
    PhaserLoadingTimedOutMessage,
    phaserLoadingTimedOutTypeGuard,
} from '../../../domain/typeGuards/game1/phaserLoadingTimedOut';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('phaserLoadingTimedOut TypeGuard', () => {
    it('when type is phaserLoadingTimedOut, it should return true', () => {
        const data: PhaserLoadingTimedOutMessage = {
            type: MessageTypesGame1.phaserLoadingTimedOut,
        };

        expect(phaserLoadingTimedOutTypeGuard(data)).toEqual(true);
    });
});
