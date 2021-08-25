import { MessageTypes } from '../../../utils/constants';
import { PlayerDiedMessage } from '../../typeGuards/playerDied';
import { handlePlayerDied } from './handlePlayerDied';

describe('playerDied function', () => {
    let setPlayerDead: jest.Mock<any, any>;
    let setPlayerRank: jest.Mock<any, any>;
    const roomId = 'ABCDE';

    const mockData: PlayerDiedMessage = {
        type: MessageTypes.playerDied,
        rank: 1,
    };

    beforeEach(() => {
        setPlayerDead = jest.fn();
        setPlayerRank = jest.fn();
    });

    it('handed playerDied should be called with true', () => {
        handlePlayerDied({
            data: mockData,
            roomId,
            dependencies: { setPlayerDead, setPlayerRank },
        });

        expect(setPlayerDead).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with passed rank', () => {
        handlePlayerDied({
            data: mockData,
            roomId,
            dependencies: { setPlayerDead, setPlayerRank },
        });

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });
});
