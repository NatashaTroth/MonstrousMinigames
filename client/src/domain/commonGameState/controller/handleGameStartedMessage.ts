import { History } from "history";

import { GameNames } from "../../../config/games";
import {
    controllerGame1Route, controllerGame2Route, controllerGame3Route
} from "../../../utils/routes";

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

export function handleGameStartedMessage(dependencies: Dependencies) {
    return (data: HandleGameStartedData) => {
        const { roomId, countdownTime, game } = data;
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
    };
}
