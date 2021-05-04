import { gameHasTimedOut } from '../../utils/gameHasTimedOut';

describe('gameHasTimedOut function', () => {
    const setPlayerFinished = jest.fn();
    const setPlayerRank = jest.fn();

    const mockData = {
        type: 'Data',
        rank: 1,
    };

    it('handed setPlayerFinished should be called with true', () => {
        gameHasTimedOut(mockData, { setPlayerFinished, setPlayerRank });

        expect(setPlayerFinished).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with handed playerRank', () => {
        gameHasTimedOut(mockData, { setPlayerFinished, setPlayerRank });

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });
});
