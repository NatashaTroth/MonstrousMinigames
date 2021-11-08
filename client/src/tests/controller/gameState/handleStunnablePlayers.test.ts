import { handleStunnablePlayers } from '../../../domain/game1/controller/gameState/handleStunnablePlayers';
import { StunnablePlayersMessage } from '../../../domain/typeGuards/game1/stunnablePlayers';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('handleStunnablePlayers function', () => {
    const mockData: StunnablePlayersMessage = {
        type: MessageTypesGame1.stunnablePlayers,
        roomId: 'ABCD',
        stunnablePlayers: ['1', '2'],
    };

    it('handed setStunnablePlayers should be called', () => {
        const setStunnablePlayers = jest.fn();

        handleStunnablePlayers({
            data: mockData,
            dependencies: { setStunnablePlayers },
        });

        expect(setStunnablePlayers).toHaveBeenLastCalledWith(mockData.stunnablePlayers);
    });
});
