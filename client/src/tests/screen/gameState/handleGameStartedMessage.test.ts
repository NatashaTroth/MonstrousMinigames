import { createMemoryHistory } from 'history';

import { GameNames } from '../../../config/games';
import { handleGameStartedMessage } from '../../../domain/commonGameState/screen/handleGameStartedMessage';

describe('gameHasStarted function', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();
    const game = GameNames.game3;

    it('handed setGameStarted should be called with true', () => {
        handleGameStartedMessage({
            roomId,
            game,
            countdownTime: 3000,
            dependencies: { setGameStarted, history, setStartingCountdownTime: jest.fn() },
        });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });
});
