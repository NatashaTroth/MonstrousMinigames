import { History } from 'history';
import React from 'react';

import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { guessHintTypeGuard } from '../../../typeGuards/game2/guessHint';

interface Dependencies {
    setGuessHint: (val: string) => void;
    history: History;
}

export const guessHintHandler = messageHandler(guessHintTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setGuessHint(message.hint);
});

export const useGuessHintHandler = (socket: Socket, handler = guessHintHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setGuessHint } = React.useContext(Game2Context);

    React.useEffect(() => {
        if (!roomId) return;
        const guessHintHandlerWithDependencies = handler({ setGuessHint, history });
        guessHintHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setGuessHint, socket]);
};
