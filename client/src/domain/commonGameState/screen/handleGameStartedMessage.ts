import { History } from "history";

import { GameNames } from "../../../utils/games";
import { controllerGame3Route } from "../../../utils/routes";

interface HandleGameStarted {
    roomId: string;
    gameId: GameNames;
    dependencies: { setGameStarted: (val: boolean) => void; history: History };
}
export function handleGameStartedMessage(props: HandleGameStarted) {
    const { roomId, dependencies, gameId } = props;
    const { setGameStarted, history } = dependencies;

    switch (gameId) {
        case GameNames.game3:
            setGameStarted(true);
            history.push(controllerGame3Route(roomId));
            return;
    }
}
