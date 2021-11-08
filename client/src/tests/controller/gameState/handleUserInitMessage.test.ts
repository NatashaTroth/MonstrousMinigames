import { handleUserInitMessage } from '../../../domain/commonGameState/controller/handleUserInitMessage';
import { UserInitMessage } from '../../../domain/typeGuards/userInit';
import { MessageTypes } from '../../../utils/constants';

describe('handleUserInitMessage', () => {
    const mockData: UserInitMessage = {
        type: MessageTypes.userInit,
        isAdmin: true,
        number: 1,
        name: 'User',
        userId: '1',
        roomId: '1',
        ready: false,
    };

    it('when message type is user init, handed setPlayerNumber should be called', () => {
        const setPlayerNumber = jest.fn();
        const setName = jest.fn();
        const setUserId = jest.fn();
        const setReady = jest.fn();

        handleUserInitMessage({
            data: mockData,
            dependencies: {
                setPlayerNumber,
                setName,
                setUserId,
                setReady,
            },
        });

        expect(setPlayerNumber).toHaveBeenCalledTimes(1);
    });
});
