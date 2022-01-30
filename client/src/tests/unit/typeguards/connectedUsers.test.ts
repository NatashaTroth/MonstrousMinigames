import { ConnectedUsersMessage, connectedUsersTypeGuard } from '../../../domain/typeGuards/connectedUsers';
import { MessageTypes } from '../../../utils/constants';

describe('connectedUsers TypeGuard', () => {
    it('when type is connectedUsers, it should return true', () => {
        const data: ConnectedUsersMessage = {
            type: MessageTypes.connectedUsers,
        };

        expect(connectedUsersTypeGuard(data)).toEqual(true);
    });
});
