import { History } from 'history';
import React from 'react';

import { Game2Context, GamePhases } from '../../../../contexts/game2/Game2ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { controllerGame2Route, controllerGuessRoute, controllerResultsRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { phaseChangedTypeGuard } from '../../../typeGuards/game2/phaseChanged';

interface Dependencies {
    setPhase: (val: GamePhases) => void;
    setRoundIdx: (val: number) => void;
    history: History;
}

export const phaseChangedHandler = messageHandler(phaseChangedTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setPhase(message.phase);
    dependencies.setRoundIdx(message.round);

    switch (message.phase) {
        case GamePhases.guessing:
            dependencies.history.push(controllerGuessRoute(message.roomId));
            return;
        case GamePhases.results:
            dependencies.history.push(controllerResultsRoute(message.roomId));
            return;
        default:
            dependencies.history.push(controllerGame2Route(message.roomId));
            return;
    }
});

export const usePhaseChangedHandler = (socket: Socket, handler = phaseChangedHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setPhase, setRoundIdx } = React.useContext(Game2Context);

    React.useEffect(() => {
        if (!roomId) return;

        const phaseChangeHandlerWithDependencies = handler({ setPhase, setRoundIdx, history });
        phaseChangeHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setPhase, setRoundIdx, socket]);
};
