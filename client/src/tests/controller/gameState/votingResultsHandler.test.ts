import { votingResultsHandler } from '../../../domain/game3/controller/gameState/votingResultsHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { VotingResultsMessage } from '../../../domain/typeGuards/game3/votingResults';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('votingResultsHandler', () => {
    const roomId = 'ANES';
    const message: VotingResultsMessage = {
        type: MessageTypesGame3.votingResults,
        roomId,
        countdownTime: 3000,
        results: [],
    };

    it('when VotingResultsMessage is written, setVotingResults should be called', async () => {
        const setVotingResults = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = votingResultsHandler({ setVotingResults });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setVotingResults).toHaveBeenCalledTimes(1);
    });
});
