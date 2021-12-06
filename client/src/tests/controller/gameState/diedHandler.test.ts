import { diedHandler } from '../../../domain/game1/controller/gameState/diedHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { PlayerDiedMessage } from '../../../domain/typeGuards/game1/playerDied';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('diedHandler', () => {
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

    it('handed playerDied should be called with true', async () => {
        const socket = new InMemorySocketFake();
        const withDependencies = diedHandler({
            setPlayerDead,
            setPlayerRank,
        });

        withDependencies(socket, roomId);

        await socket.emit(mockData);

        expect(setPlayerDead).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with passed rank', async () => {
        const socket = new InMemorySocketFake();
        const withDependencies = diedHandler({
            setPlayerDead,
            setPlayerRank,
        });

        withDependencies(socket, roomId);

        await socket.emit(mockData);

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });
});
