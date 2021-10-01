import { History } from 'history';

import { GameNames } from '../../../utils/games';
import { controllerGame3Route } from '../../../utils/routes';

interface HandleGameStarted {
    roomId: string;
    game: GameNames;
    dependencies: { setGameStarted: (val: boolean) => void; history: History };
}
export function handleGameStartedMessage(props: HandleGameStarted) {
    const { roomId, dependencies, game } = props;
    const { setGameStarted, history } = dependencies;

    switch (game) {
        case GameNames.game3:
            setGameStarted(true);
            history.push(controllerGame3Route(roomId));
            return;
    }
}
