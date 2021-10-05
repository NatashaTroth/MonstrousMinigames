import { History } from "history";

import { screenGame1Route } from "../../../utils/routes";

interface HandleStartPhaserGame {
    roomId: string;
    dependencies: {
        setGameStarted: (val: boolean) => void;
        history: History;
    };
}

export function handleStartPhaserGameMessage(props: HandleStartPhaserGame) {
    const { dependencies, roomId } = props;
    const { setGameStarted, history } = dependencies;

    setGameStarted(true);
    history.push(screenGame1Route(roomId));
}
