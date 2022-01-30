import { VotingResultsMessage, votingResultsTypeGuard } from '../../../domain/typeGuards/game3/votingResults';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('votingResults TypeGuard', () => {
    it('when type is votingResults, it should return true', () => {
        const data: VotingResultsMessage = {
            type: MessageTypesGame3.votingResults,
            roomId: 'ADGS',
            countdownTime: 3000,
            results: [],
        };

        expect(votingResultsTypeGuard(data)).toEqual(true);
    });
});
