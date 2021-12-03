import { History } from "history";

import { controllerLobbyRoute } from "../../../utils/routes";
import messageHandler from "../../socket/messageHandler";
import { stoppedTypeGuard } from "../../typeGuards/stopped";

interface Dependencies {
    history: History;
}

export const stopHandler = messageHandler(stoppedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.history.push(controllerLobbyRoute(roomId));
});
