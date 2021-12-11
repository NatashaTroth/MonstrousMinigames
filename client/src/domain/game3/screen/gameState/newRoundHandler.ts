import React from 'react';

import { Game3Context, Vote, VoteResult } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
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

export const useNewRoundHandler = (socket: Socket, handler = newRoundHandler) => {
    const { setRoundIdx, setVoteForPhotoMessage, setVotingResults } = React.useContext(Game3Context);
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const newRoundHandlerWithDependencies = handler({
            setRoundIdx,
            setVoteForPhotoMessage,
            setVotingResults,
        });

        newRoundHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setRoundIdx, setVoteForPhotoMessage, setVotingResults, socket]);
};
