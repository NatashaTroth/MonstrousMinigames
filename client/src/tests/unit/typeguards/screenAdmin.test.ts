import { ScreenAdminMessage, screenAdminTypeGuard } from '../../../domain/typeGuards/screenAdmin';
import { MessageTypes } from '../../../utils/constants';

describe('screen admin TypeGuard', () => {
    it('when type is screenAdmin, it should return true', () => {
        const data: ScreenAdminMessage = {
            type: MessageTypes.screenAdmin,
            isAdmin: true,
        };

        expect(screenAdminTypeGuard(data)).toEqual(true);
    });
});
