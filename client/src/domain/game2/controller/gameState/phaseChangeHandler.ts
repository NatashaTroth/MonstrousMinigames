import { History } from 'history';
import React from 'react';

import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { GamePhases } from '../../../../contexts/game2/Game2ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { controllerGame2Route, controllerGuessRoute, controllerResultsRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { phaseChangedTypeGuard } from '../../../typeGuards/game2/phaseChanged';

interface Dependencies {
    setPhase: (val: GamePhases) => void;
    history: History;
}

export const phaseChangedHandler = messageHandler(phaseChangedTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setPhase(message.phase);
    if (message.phase == GamePhases.guessing) {
        dependencies.history.push(controllerGuessRoute(message.roomId));
    } else if (message.phase == GamePhases.results) {
        dependencies.history.push(controllerResultsRoute(message.roomId));
    } else {
        dependencies.history.push(controllerGame2Route(message.roomId));
    }
});

export const usePhaseChangedHandler = (socket: Socket, handler = phaseChangedHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setPhase } = React.useContext(Game2Context);

    React.useEffect(() => {
        if (!roomId) return;

        const presentFinalPhotosHandlerWithDependencies = handler({ setPhase, history });
        presentFinalPhotosHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setPhase, socket]);
};
