import { MessageTypes } from '../../utils/constants';
import { ConnectedUsersMessage, connectedUsersTypeGuard } from './connectedUsers';

describe('finished TypeGuard', () => {
    it('when type is gameHasFinished, it should return true', () => {
        const data: ConnectedUsersMessage = {
            type: MessageTypes.connectedUsers,
        };

        expect(connectedUsersTypeGuard(data)).toEqual(true);
    });
});
