import { MessageTypes } from '../../utils/constants';
import { ScreenAdminMessage, screenAdminTypeGuard } from './screenAdmin';

describe('paused TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: ScreenAdminMessage = {
            type: MessageTypes.screenAdmin,
        };

        expect(screenAdminTypeGuard(data)).toEqual(true);
    });
});
