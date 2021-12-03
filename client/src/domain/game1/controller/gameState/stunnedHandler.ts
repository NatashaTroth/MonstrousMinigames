import { History } from "history";

import { controllerPlayerStunnedRoute } from "../../../../utils/routes";
import messageHandler from "../../../socket/messageHandler";
import { playerStunnedTypeGuard } from "../../../typeGuards/game1/playerStunned";

interface Dependencies {
    history: History;
}
export const stunnedHandler = messageHandler(playerStunnedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.history.push(controllerPlayerStunnedRoute(roomId));
});
