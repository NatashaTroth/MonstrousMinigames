import { VoteResult } from '../../../../contexts/game3/Game3ContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { votingResultsTypeGuard } from '../../../typeGuards/game3/votingResults';

interface Dependencies {
    setVotingResults: (val: VoteResult) => void;
}

export const votingResultsHandler = messageHandler(votingResultsTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setVotingResults({ results: message.results, countdownTime: message.countdownTime });
});
