import { MessageTypes } from '../../../utils/constants';
import { ConnectedUsersMessage } from '../../typeGuards/connectedUsers';
import { handleConnectedUsersMessage } from './handleConnectedUsersMessage';

describe('handleConnectedUsersMessage', () => {
    it('handed setConnectedUsers should be called with handed data', () => {
        const setConnectedUsers = jest.fn();

        const data: ConnectedUsersMessage = { type: MessageTypes.connectedUsers, users: [] };

        handleConnectedUsersMessage({
            data,
            dependencies: { setConnectedUsers },
        });

        expect(setConnectedUsers).toHaveBeenCalledWith(data.users);
    });
});
