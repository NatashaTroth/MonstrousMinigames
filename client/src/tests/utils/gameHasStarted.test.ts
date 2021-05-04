import { gameHasStarted } from '../../utils/gameHasStarted';

describe('gameHasStarted function', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';

    it('handed setGameStarted should be called with true', () => {
        gameHasStarted(roomId, { setGameStarted });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });
});
