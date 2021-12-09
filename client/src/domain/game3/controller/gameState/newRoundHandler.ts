import { History } from 'history';
import React from 'react';

import { Game3Context, Vote, VoteResult } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { controllerGame3Route } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
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

export const useNewRoundHandler = (socket: Socket, handler = newRoundHandler) => {
    const { roomId } = React.useContext(GameContext);
    const {
        setVoteForPhotoMessage,
        setRoundIdx,

        setVotingResults,
    } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;
        const newRoundHandlerWithDependencies = handler({
            setRoundIdx,
            setVoteForPhotoMessage,
            setVotingResults,
            history,
        });

        newRoundHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setRoundIdx, setVoteForPhotoMessage, setVotingResults, socket]);
};
