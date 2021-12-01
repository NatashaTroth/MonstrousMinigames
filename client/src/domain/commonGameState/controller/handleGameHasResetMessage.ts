import { History } from "history";

import { controllerLobbyRoute } from "../../../utils/routes";

interface Dependencies {
    history: History;
    resetController: () => void;
}

export function handleGameHasResetMessage(dependencies: Dependencies) {
    return (roomId: string) => {
        const { resetController, history } = dependencies;
        resetController();
        history.push(controllerLobbyRoute(roomId));
    };
}
