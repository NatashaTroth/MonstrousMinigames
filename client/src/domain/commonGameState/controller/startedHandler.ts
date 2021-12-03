import { History } from "history";

import { GameNames } from "../../../config/games";
import {
    controllerGame1Route, controllerGame2Route, controllerGame3Route
} from "../../../utils/routes";
import messageHandler from "../../socket/messageHandler";
import { startedTypeGuard } from "../../typeGuards/game1/started";

interface Dependencies {
    setGameStarted: (val: boolean) => void;
    history: History;
    setCountdownTime: (time: number) => void;
}
export interface HandleGameStartedData {
    roomId: string;
    game: GameNames;
    countdownTime: number;
}

export const startedHandler = messageHandler(startedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    const { countdownTime, game } = message;
    const { setGameStarted, history, setCountdownTime } = dependencies;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    setGameStarted(true);
    setCountdownTime(countdownTime);

    switch (game) {
        case GameNames.game1:
            history.push(controllerGame1Route(roomId));
            return;
        case GameNames.game2:
            history.push(controllerGame2Route(roomId));
            return;
        case GameNames.game3:
            history.push(controllerGame3Route(roomId));
            return;
    }
});
