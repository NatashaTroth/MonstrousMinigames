import { Vote, VoteResult } from '../../../../contexts/game3/Game3ContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { newRoundTypeGuard } from '../../../typeGuards/game3/newRound';

interface Dependencies {
    setRoundIdx: (roundIdx: number) => void;
    setVoteForPhotoMessage: (val: Vote) => void;
    setVotingResults: (val: VoteResult) => void;
}

export const newRoundHandler = messageHandler(newRoundTypeGuard, (message, dependencies: Dependencies) => {
    const { setRoundIdx, setVoteForPhotoMessage, setVotingResults } = dependencies;
    setRoundIdx(message.roundIdx);
    setVoteForPhotoMessage(undefined);
    setVotingResults(undefined);
});
