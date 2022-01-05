import React from 'react';

import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { guessHintTypeGuard } from '../../../typeGuards/game2/guessHint';

interface Dependencies {
    setGuessHint: (val: string) => void;
}

export const guessHintHandler = messageHandler(guessHintTypeGuard, (message, dependencies: Dependencies) => {
    const { setGuessHint } = dependencies;
    setGuessHint(message.hint);
});

export const useGuessHintHandler = (socket: Socket, handler = guessHintHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setGuessHint } = React.useContext(Game2Context);

    React.useEffect(() => {
        if (!roomId) return;

        const guessHintHandlerWithDependencies = handler({ setGuessHint });
        guessHintHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setGuessHint, socket]);
};
