import { History } from "history";

import { controllerGame1Route } from "../../../../utils/routes";
import messageHandler from "../../../socket/messageHandler";
import { playerUnstunnedTypeGuard } from "../../../typeGuards/game1/playerUnstunned";

interface Dependencies {
    history: History;
}

export const unstunnedHandler = messageHandler(
    playerUnstunnedTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        dependencies.history.push(controllerGame1Route(roomId));
    }
);
