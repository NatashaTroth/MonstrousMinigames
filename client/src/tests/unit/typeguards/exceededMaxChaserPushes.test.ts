import {
    ExceededMaxChaserPushesMessage,
    exceededMaxChaserPushesTypeGuard,
} from '../../../domain/typeGuards/game1/exceededMaxChaserPushes';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('exceededMaxChaserPushes TypeGuard', () => {
    it('when type is exceededMaxChaserPushes, it should return true', () => {
        const data: ExceededMaxChaserPushesMessage = {
            type: MessageTypesGame1.exceededNumberOfChaserPushes,
        };

        expect(exceededMaxChaserPushesTypeGuard(data)).toEqual(true);
    });
});
