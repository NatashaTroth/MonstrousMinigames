import { createMemoryHistory } from 'history';

import { MessageTypes } from '../../../utils/constants';
import { handleMessageData } from './handleMessageData';

describe('handleMessageData function Screen', () => {
    let setHasPaused: jest.Mock<any, any>;
    let handleGameHasFinished: jest.Mock<any, any>;
    let setGameStarted: jest.Mock<any, any>;
    let setCountdownTime: jest.Mock<any, any>;
    let setConnectedUsers: jest.Mock<any, any>;
    let setHasTimedOut: jest.Mock<any, any>;

    const history = createMemoryHistory();
    const roomId = '1234';

    beforeEach(() => {
        setHasPaused = jest.fn();
        handleGameHasFinished = jest.fn();
        setGameStarted = jest.fn();
        setCountdownTime = jest.fn();
        setConnectedUsers = jest.fn();
        setHasTimedOut = jest.fn();
    });

    it('when message type is gameHasPaused, handed setHasPaused should be called with true', () => {
        const mockData = {
            type: MessageTypes.gameHasPaused,
        };

        handleMessageData({
            messageData: mockData,
            roomId,
            dependencies: {
                setHasPaused,
                handleGameHasFinished,
                setGameStarted,
                setCountdownTime,
                setConnectedUsers,
                setHasTimedOut,
                history,
            },
        });

        expect(setHasPaused).toHaveBeenCalledWith(true);
    });

    it('when message type is gameHasResumed, handed setHasPaused should be called with false', () => {
        const mockData = {
            type: MessageTypes.gameHasResumed,
        };

        handleMessageData({
            messageData: mockData,
            roomId,
            dependencies: {
                setHasPaused,
                handleGameHasFinished,
                setGameStarted,
                setCountdownTime,
                setConnectedUsers,
                setHasTimedOut,
                history,
            },
        });

        expect(setHasPaused).toHaveBeenCalledWith(false);
    });

    it('when message type is gameHasStopped, history push should be called', () => {
        const mockData = {
            type: MessageTypes.gameHasStopped,
        };
        const history = createMemoryHistory();

        handleMessageData({
            messageData: mockData,
            roomId,
            dependencies: {
                setHasPaused,
                handleGameHasFinished,
                setGameStarted,
                setCountdownTime,
                setConnectedUsers,
                setHasTimedOut,
                history,
            },
        });

        expect(history.location).toHaveProperty('pathname', `/screen/${roomId}/lobby`);
    });
});
