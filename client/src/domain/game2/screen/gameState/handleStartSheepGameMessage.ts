import { History } from 'history';

import { screenGame2Route } from '../../../../utils/routes';

interface Dependencies {
    setSheepGameStarted: (val: boolean) => void;
    history: History;
}

export function handleStartSheepGameMessage(dependencies: Dependencies) {
    return (roomId: string) => {
        const { setSheepGameStarted, history } = dependencies;

        setSheepGameStarted(true);
        history.push(screenGame2Route(roomId));
    };
}
