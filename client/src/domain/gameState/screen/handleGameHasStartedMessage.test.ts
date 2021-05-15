import { createMemoryHistory } from 'history';

import { MessageTypes } from '../../../utils/constants';
import { GameHasStartedMessage } from '../../typeGuards/started';
import { handleGameHasStartedMessage } from './handleGameHasStartedMessage';

describe('handleGameHasStartedMessage', () => {
    const roomId = '1234';

    it('when message type is gameStarted, history push should be called', () => {
        const history = createMemoryHistory();
        const setCountdownTime = jest.fn();
        const setGameStarted = jest.fn();
        const data: GameHasStartedMessage = { type: MessageTypes.started, countdownTime: 3000 };

        handleGameHasStartedMessage({ data, roomId, dependencies: { history, setCountdownTime, setGameStarted } });

        expect(history.location).toHaveProperty('pathname', `/screen/${roomId}/game1`);
    });

    it('handed setCountdownTime should be called with passed data', () => {
        const history = createMemoryHistory();
        const setCountdownTime = jest.fn();
        const setGameStarted = jest.fn();
        const data: GameHasStartedMessage = { type: MessageTypes.started, countdownTime: 3000 };

        handleGameHasStartedMessage({ data, roomId, dependencies: { history, setCountdownTime, setGameStarted } });

        expect(setCountdownTime).toHaveBeenCalledWith(data.countdownTime);
    });

    it('handed setGameStarted should be called with true', () => {
        const history = createMemoryHistory();
        const setCountdownTime = jest.fn();
        const setGameStarted = jest.fn();
        const data: GameHasStartedMessage = { type: MessageTypes.started, countdownTime: 3000 };

        handleGameHasStartedMessage({
            data,
            roomId,
            dependencies: { history, setCountdownTime, setGameStarted },
        });

        expect(setGameStarted).toHaveBeenCalledWith(true);
    });
});
