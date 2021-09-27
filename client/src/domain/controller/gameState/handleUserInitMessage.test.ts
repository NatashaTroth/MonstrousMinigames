import { MessageTypes } from '../../../utils/constants';
import { UserInitMessage } from '../../typeGuards/userInit';
import { handleUserInitMessage } from './handleUserInitMessage';

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
    /*
    it('when message type is user init, handed setPlayerAdmin should be called', () => {
        const setPlayerAdmin = jest.fn();
        const setPlayerNumber = jest.fn();
        const setName = jest.fn();
        const setUserId = jest.fn();

        handleUserInitMessage({
            data: mockData,
            dependencies: {
                setPlayerAdmin,
                setPlayerNumber,
                setName,
                setUserId,
            },
        });

        expect(setPlayerAdmin).toHaveBeenCalledTimes(1);
    });
    */

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
