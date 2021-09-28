import { MessageTypes } from '../../utils/constants';
import { ScreenAdminMessage, screenAdminTypeGuard } from './screenAdmin';

describe('screen admin TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: ScreenAdminMessage = {
            type: MessageTypes.screenAdmin,
            isAdmin: true,
        };

        expect(screenAdminTypeGuard(data)).toEqual(true);
    });
});
