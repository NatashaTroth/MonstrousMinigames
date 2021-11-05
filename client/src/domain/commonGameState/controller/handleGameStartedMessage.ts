import { History } from 'history';

import { GameNames } from '../../../config/games';
import { controllerGame1Route, controllerGame2Route, controllerGame3Route } from '../../../utils/routes';

interface HandleGameStarted {
    roomId: string;
    game: GameNames;
    countdownTime: number;
    dependencies: { setGameStarted: (val: boolean) => void; history: History };
}
export function handleGameStartedMessage(props: HandleGameStarted) {
    const { roomId, dependencies, countdownTime, game } = props;
    const { setGameStarted, history } = dependencies;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.userSelect = 'none';
    setGameStarted(true);
    sessionStorage.setItem('countdownTime', String(countdownTime));

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
}
