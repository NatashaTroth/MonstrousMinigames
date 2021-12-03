import { History } from "history";

import { controllerLobbyRoute } from "../../../utils/routes";
import messageHandler from "../../socket/messageHandler";
import { resetTypeGuard } from "../../typeGuards/reset";

interface Dependencies {
    history: History;
    resetController: () => void;
}

export const resetHandler = messageHandler(resetTypeGuard, (message, dependencies: Dependencies, roomId) => {
    const { resetController, history } = dependencies;
    resetController();
    history.push(controllerLobbyRoute(roomId));
});
