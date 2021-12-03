import { handlePlayerDied } from '../../../domain/game1/controller/gameState/handlePlayerDied';
import { PlayerDiedMessage } from '../../../domain/typeGuards/game1/playerDied';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('playerDied function', () => {
    let setPlayerDead: jest.Mock<any, any>;
    let setPlayerRank: jest.Mock<any, any>;
    const roomId = 'ABCDE';

    const mockData: PlayerDiedMessage = {
        type: MessageTypesGame1.playerDied,
        rank: 1,
    };

    beforeEach(() => {
        setPlayerDead = jest.fn();
        setPlayerRank = jest.fn();
    });

    it('handed playerDied should be called with true', () => {
        const withDependencies = handlePlayerDied({
            setPlayerDead,
            setPlayerRank,
        });

        withDependencies({ data: mockData, roomId });

        expect(setPlayerDead).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with passed rank', () => {
        const withDependencies = handlePlayerDied({
            setPlayerDead,
            setPlayerRank,
        });

        withDependencies({ data: mockData, roomId });

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });
});
