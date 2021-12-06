import { resumeHandler } from '../../../domain/commonGameState/resumeHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { GameHasResumedMessage } from '../../../domain/typeGuards/resumed';
import { MessageTypes } from '../../../utils/constants';

describe('resumeHandler', () => {
    const mockData: GameHasResumedMessage = {
        type: MessageTypes.gameHasResumed,
    };

    it('when GameHasResumedMessage is emitted, handed setHasPause should be called with false', async () => {
        const setHasPaused = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = resumeHandler({ setHasPaused });
        withDependencies(socket, 'SDFO');

        await socket.emit(mockData);

        expect(setHasPaused).toHaveBeenCalledWith(false);
    });
});
