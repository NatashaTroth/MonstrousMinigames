import { createMemoryHistory } from 'history';

import { handleStartPhaserGameMessage } from '../../../domain/commonGameState/screen/handleStartPhaserGameMessage';
import { screenGame1Route } from '../../../utils/routes';

describe('handleStartPhaserGameMessage', () => {
    const roomId = '1234';

    it('when phaser game has started, history push should be called', () => {
        const history = createMemoryHistory();
        const setGameStarted = jest.fn();

        const withDependencies = handleStartPhaserGameMessage({ history, setGameStarted });

        withDependencies(roomId);

        expect(history.location).toHaveProperty('pathname', screenGame1Route(roomId));
    });

    it('handed setGameStarted should be called with true', () => {
        const history = createMemoryHistory();
        const setGameStarted = jest.fn();

        const withDependencies = handleStartPhaserGameMessage({ history, setGameStarted });

        withDependencies(roomId);

        expect(setGameStarted).toHaveBeenCalledWith(true);
    });
});
