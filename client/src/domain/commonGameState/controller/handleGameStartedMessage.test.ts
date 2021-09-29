import { createMemoryHistory } from 'history';

import { handleGameStartedMessage } from './handleGameStartedMessage';

describe('gameHasStarted function', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();
    const countdownTime = 3000;

    it('handed setGameStarted should be called with true', () => {
        handleGameStartedMessage({ roomId, countdownTime, dependencies: { setGameStarted, history } });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });
});
