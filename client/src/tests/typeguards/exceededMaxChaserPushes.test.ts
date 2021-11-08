import { MessageTypesGame1 } from '../../../utils/constants';
import { ExceededMaxChaserPushesMessage, exceededMaxChaserPushesTypeGuard } from './exceededMaxChaserPushes';

describe('exceededMaxChaserPushes TypeGuard', () => {
    it('when type is exceededMaxChaserPushes, it should return true', () => {
        const data: ExceededMaxChaserPushesMessage = {
            type: MessageTypesGame1.exceededNumberOfChaserPushes,
        };

        expect(exceededMaxChaserPushesTypeGuard(data)).toEqual(true);
    });
});
