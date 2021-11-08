import { handleSetGameStarted } from '../../../domain/commonGameState/controller/handleSetGameStarted';

describe('handleSetGameStarted', () => {
    it('handed setGameStarted function should be called with started value', () => {
        const setGameStarted = jest.fn();
        const started = true;

        handleSetGameStarted(true, { setGameStarted });

        expect(setGameStarted).toHaveBeenLastCalledWith(started);
    });
});
