import { UserInitMessage, userInitTypeGuard } from '../../domain/typeGuards/userInit';
import { MessageTypes } from '../../utils/constants';

describe('userInit TypeGuard', () => {
    it('when type is userInit, it should return true', () => {
        const data: UserInitMessage = {
            type: MessageTypes.userInit,
            name: 'User',
            roomId: '1',
            userId: '1',
            isAdmin: true,
            number: 1,
            ready: false,
        };

        expect(userInitTypeGuard(data)).toEqual(true);
    });
});
