import { History } from 'history';

import { screenGame1Route, screenGame2Route } from '../../../utils/routes';

interface HandleStartPhaserGame {
    roomId: string;
    dependencies: {
        setGameStarted: (val: boolean) => void;
        history: History;
    };
}

export function handleStartGameMessage(props: HandleStartPhaserGame) {
    const { dependencies, roomId } = props;
    const { setGameStarted, history } = dependencies;

    setGameStarted(true);
    history.push(screenGame1Route(roomId));
}

interface HandleStartSheepGame {
    roomId: string;
    dependencies: {
        setSheepGameStarted: (val: boolean) => void;
        history: History;
    };
}

export function handleStartSheepGameMessage(props: HandleStartSheepGame) {
    const { dependencies, roomId } = props;
    const { setSheepGameStarted, history } = dependencies;

    setSheepGameStarted(true);
    history.push(screenGame2Route(roomId));
}
