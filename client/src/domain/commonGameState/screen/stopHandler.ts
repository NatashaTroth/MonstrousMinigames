import { History } from "history";
import React from "react";

import { GameContext } from "../../../contexts/GameContextProvider";
import { screenLobbyRoute } from "../../../utils/routes";
import history from "../../history/history";
import messageHandler from "../../socket/messageHandler";
import { Socket } from "../../socket/Socket";
import { stoppedTypeGuard } from "../../typeGuards/stopped";

interface Dependencies {
    history: History;
    setPlayCount: (val: number) => void;
    playCount: number;
}

export const stopHandler = messageHandler(stoppedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.setPlayCount(dependencies.playCount + 1);
    dependencies.history.push(screenLobbyRoute(roomId));
});

export const useStopHandler = (socket: Socket, handler = stopHandler) => {
    const { roomId, setPlayCount, playCount } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;
        const stopHandlerWithDependencies = handler({ history, setPlayCount, playCount });
        stopHandlerWithDependencies(socket, roomId);
    }, [handler, playCount, roomId, setPlayCount, socket]);
};
