import { pauseHandler } from '../../../domain/commonGameState/pauseHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { GameHasPausedMessage } from '../../../domain/typeGuards/paused';
import { MessageTypes } from '../../../utils/constants';

describe('pauseHandler', () => {
    const mockData: GameHasPausedMessage = {
        type: MessageTypes.gameHasPaused,
    };

    it('when GameHasPausedMessage is emitted, handed setHasPause should be called with true', async () => {
        const setHasPaused = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = pauseHandler({ setHasPaused });
        withDependencies(socket, 'SSWG');

        await socket.emit(mockData);

        expect(setHasPaused).toHaveBeenCalledWith(true);
    });
});
