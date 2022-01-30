import React from 'react';

import { Game3Context, VoteResult } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { votingResultsTypeGuard } from '../../../typeGuards/game3/votingResults';

interface Dependencies {
    setVotingResults: (val: VoteResult) => void;
}

export const votingResultsHandler = messageHandler(votingResultsTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setVotingResults({ results: message.results, countdownTime: message.countdownTime });
});

export const useVotingResultsHandler = (socket: Socket, handler = votingResultsHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setVotingResults } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;

        const votingResultsHandlerWithDependencies = handler({ setVotingResults });
        votingResultsHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
