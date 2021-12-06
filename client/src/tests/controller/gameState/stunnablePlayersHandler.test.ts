import { stunnablePlayersHandler } from '../../../domain/game1/controller/gameState/stunnablePlayersHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { StunnablePlayersMessage } from '../../../domain/typeGuards/game1/stunnablePlayers';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('stunnablePlayersHandler', () => {
    const mockData: StunnablePlayersMessage = {
        type: MessageTypesGame1.stunnablePlayers,
        roomId: 'ABCD',
        stunnablePlayers: ['1', '2'],
    };

    it('handed setStunnablePlayers should be called', async () => {
        const setStunnablePlayers = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = stunnablePlayersHandler({
            setStunnablePlayers,
        });

        withDependencies(socket, mockData.roomId);

        await socket.emit(mockData);

        expect(setStunnablePlayers).toHaveBeenLastCalledWith(mockData.stunnablePlayers);
    });
});
