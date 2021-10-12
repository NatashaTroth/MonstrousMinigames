import { History } from 'history';

import { GameNames } from '../../../config/games';
import { screenGame3Route } from '../../../utils/routes';

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
            history.push(screenGame3Route(roomId));
            return;
    }
}
