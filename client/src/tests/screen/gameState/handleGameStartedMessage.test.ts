import { createMemoryHistory } from 'history';

import { GameNames } from '../../../config/games';
import { handleGameStartedMessage } from '../../../domain/commonGameState/screen/handleGameStartedMessage';

describe('gameHasStarted function', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();
    const game = GameNames.game3;

    it('handed setGameStarted should be called with true', () => {
        const withDependencies = handleGameStartedMessage({ setGameStarted, history, setCountdownTime: jest.fn() });

        withDependencies({ roomId, game, countdownTime: 3000 });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });
});
