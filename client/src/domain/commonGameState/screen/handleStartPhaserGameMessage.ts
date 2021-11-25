import { History } from 'history';

import { screenGame1Route } from '../../../utils/routes';

interface Dependencies {
    setGameStarted: (val: boolean) => void;
    history: History;
}

export function handleStartPhaserGameMessage(dependencies: Dependencies) {
    return (roomId: string) => {
        const { setGameStarted, history } = dependencies;

        setGameStarted(true);
        history.push(screenGame1Route(roomId));
    };
}
