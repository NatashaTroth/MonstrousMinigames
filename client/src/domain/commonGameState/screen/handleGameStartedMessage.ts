import { History } from 'history';

import { GameNames } from '../../../config/games';
import { screenGame3Route } from '../../../utils/routes';

interface HandleGameStarted {
    roomId: string;
    game: GameNames;
    countdownTime: number;
    dependencies: {
        setGameStarted: (val: boolean) => void;
        history: History;
        setCountdownTime: (val: number) => void;
    };
}
export function handleGameStartedMessage(props: HandleGameStarted) {
    const { roomId, dependencies, game, countdownTime } = props;
    const { setGameStarted, history, setCountdownTime } = dependencies;

    switch (game) {
        case GameNames.game3:
            setGameStarted(true);
            setCountdownTime(countdownTime);
            history.push(screenGame3Route(roomId));
            return;
    }
}
