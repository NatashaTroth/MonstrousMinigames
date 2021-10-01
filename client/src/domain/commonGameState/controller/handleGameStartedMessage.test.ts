import { createMemoryHistory } from 'history';

import { GameNames } from '../../../utils/games';
import { handleGameStartedMessage } from './handleGameStartedMessage';

describe('gameHasStarted function', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();
    const game = GameNames.game1;
    const countdownTime = 3000;

    it('handed setGameStarted should be called with true', () => {
        handleGameStartedMessage({ roomId, game, countdownTime, dependencies: { setGameStarted, history } });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });
});
