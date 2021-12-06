import { History } from 'history';

import { Vote, VoteResult } from '../../../../contexts/game3/Game3ContextProvider';
import { controllerGame3Route } from '../../../../utils/routes';
import messageHandler from '../../../socket/messageHandler';
import { newRoundTypeGuard } from '../../../typeGuards/game3/newRound';

interface Dependencies {
    setVoteForPhotoMessage: (val: Vote) => void;
    setRoundIdx: (roundIdx: number) => void;
    setVotingResults: (val: VoteResult) => void;
    history: History;
}

export const newRoundHandler = messageHandler(newRoundTypeGuard, (message, dependencies: Dependencies) => {
    const { setRoundIdx, setVotingResults, setVoteForPhotoMessage, history } = dependencies;
    setRoundIdx(message.roundIdx);
    setVotingResults(undefined);
    setVoteForPhotoMessage(undefined);
    history.push(controllerGame3Route(message.roomId));
});
