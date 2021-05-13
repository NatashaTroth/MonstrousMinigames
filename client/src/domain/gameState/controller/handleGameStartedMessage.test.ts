import { createMemoryHistory } from 'history';

import { handleGameStartedMessage } from './handleGameStartedMessage';

describe('gameHasStarted function', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();

    it('handed setGameStarted should be called with true', () => {
        handleGameStartedMessage({ roomId, dependencies: { setGameStarted, history } });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });
});
