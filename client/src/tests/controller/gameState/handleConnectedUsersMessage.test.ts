import { handleConnectedUsersMessage } from '../../../domain/commonGameState/controller/handleConnectedUsersMessage';
import { ConnectedUsersMessage } from '../../../domain/typeGuards/connectedUsers';
import { MessageTypes } from '../../../utils/constants';

describe('handleConnectedUsersMessage function', () => {
    const mockData: ConnectedUsersMessage = {
        type: MessageTypes.connectedUsers,
        users: [
            {
                id: '1',
                name: 'Test',
                roomId: 'ABCD',
                number: 1,
                characterNumber: 1,
                active: true,
                ready: true,
            },
        ],
    };

    it('handed setAvailableCharacters should be called', () => {
        const setAvailableCharacters = jest.fn();
        const setConnectedUsers = jest.fn();

        handleConnectedUsersMessage({
            data: mockData,
            dependencies: { setAvailableCharacters, setConnectedUsers },
        });

        expect(setAvailableCharacters).toHaveBeenCalledTimes(1);
    });

    it('handed setConnectedUsers should be called', () => {
        const setAvailableCharacters = jest.fn();
        const setConnectedUsers = jest.fn();

        handleConnectedUsersMessage({
            data: mockData,
            dependencies: { setAvailableCharacters, setConnectedUsers },
        });

        expect(setConnectedUsers).toHaveBeenCalledWith(mockData.users);
    });

    it('handed setConnectedUsers should be called with empty array', () => {
        const setAvailableCharacters = jest.fn();
        const setConnectedUsers = jest.fn();

        handleConnectedUsersMessage({
            data: {
                type: MessageTypes.connectedUsers,
            },
            dependencies: { setAvailableCharacters, setConnectedUsers },
        });

        expect(setConnectedUsers).toHaveBeenCalledWith([]);
    });
});
