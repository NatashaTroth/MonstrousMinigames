import { handleConnectedUsersMessage } from '../../../domain/commonGameState/screen/handleConnectedUsersMessage';
import { ConnectedUsersMessage } from '../../../domain/typeGuards/connectedUsers';
import { MessageTypes } from '../../../utils/constants';

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
