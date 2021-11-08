import { createMemoryHistory } from 'history';

import { handleSocketConnection } from '../../domain/socket/screen/handleSocketConnection';

describe('Screen Socket Connection', () => {
    it('handed setRoomId function should be called with handed roomId', () => {
        const roomId = 'ABCD';
        const history = createMemoryHistory();
        const setRoomId = jest.fn();
        const dependencies = {
            setScreenSocket: jest.fn(),
            setConnectedUsers: jest.fn(),
            setHasPaused: jest.fn(),
            setGameStarted: jest.fn(),
            setCountdownTime: jest.fn(),
            setFinished: jest.fn(),
            setPlayerRanks: jest.fn(),
            setScreenAdmin: jest.fn(),
            setScreenState: jest.fn(),
            setChosenGame: jest.fn(),
            setTopicMessage: jest.fn(),
            setVoteForPhotoMessage: jest.fn(),
            setTimeIsUp: jest.fn(),
            setRoomId,
            history,
        };

        handleSocketConnection(roomId, 'Test', dependencies);

        expect(setRoomId).toHaveBeenLastCalledWith(roomId);
    });
});
