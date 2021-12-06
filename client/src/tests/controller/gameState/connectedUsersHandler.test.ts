import { connectedUsersHandler } from '../../../domain/commonGameState/controller/connectedUsersHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { ConnectedUsersMessage } from '../../../domain/typeGuards/connectedUsers';
import { MessageTypes } from '../../../utils/constants';

describe('connectedUsersHandler', () => {
    const roomId = 'ABCD';
    const mockData: ConnectedUsersMessage = {
        type: MessageTypes.connectedUsers,
        users: [
            {
                id: '1',
                name: 'Test',
                roomId,
                number: 1,
                characterNumber: 1,
                active: true,
                ready: true,
            },
        ],
    };

    it('when ConnectedUsersMessage is emitted, handed setAvailableCharacters should be called', async () => {
        const setAvailableCharacters = jest.fn();
        const setConnectedUsers = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = connectedUsersHandler({ setAvailableCharacters, setConnectedUsers });
        withDependencies(socket, roomId);

        await socket.emit(mockData);

        expect(setAvailableCharacters).toHaveBeenCalledTimes(1);
    });

    it('when ConnectedUsersMessage is emitted, handed setConnectedUsers should be called', async () => {
        const setAvailableCharacters = jest.fn();
        const setConnectedUsers = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = connectedUsersHandler({ setAvailableCharacters, setConnectedUsers });
        withDependencies(socket, roomId);

        await socket.emit(mockData);

        expect(setConnectedUsers).toHaveBeenCalledWith(mockData.users);
    });

    it('when ConnectedUsersMessage is emitted, handed setConnectedUsers should be called with empty array', async () => {
        const setAvailableCharacters = jest.fn();
        const setConnectedUsers = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = connectedUsersHandler({ setAvailableCharacters, setConnectedUsers });
        withDependencies(socket, roomId);

        await socket.emit({
            type: MessageTypes.connectedUsers,
        });

        expect(setConnectedUsers).toHaveBeenCalledWith([]);
    });
});
