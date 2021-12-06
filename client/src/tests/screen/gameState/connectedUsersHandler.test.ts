import { connectedUsersHandler } from '../../../domain/commonGameState/screen/connectedUsersHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { ConnectedUsersMessage } from '../../../domain/typeGuards/connectedUsers';
import { MessageTypes } from '../../../utils/constants';

describe('connectedUsersHandler', () => {
    it('handed setConnectedUsers should be called with handed data', async () => {
        const setConnectedUsers = jest.fn();
        const socket = new InMemorySocketFake();
        const roomId = 'ADES';

        const data: ConnectedUsersMessage = { type: MessageTypes.connectedUsers, users: [] };

        const withDependencies = connectedUsersHandler({
            setConnectedUsers,
        });

        withDependencies(socket, roomId);

        await socket.emit(data);

        expect(setConnectedUsers).toHaveBeenCalledWith(data.users);
    });
});
