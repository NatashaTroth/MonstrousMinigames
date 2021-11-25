import { History } from 'history';

import { GameNames } from '../../../config/games';
import { screenGame3Route } from '../../../utils/routes';

export interface HandleGameStartedProps {
    roomId: string;
    game: GameNames;
    countdownTime: number;
}

interface Dependencies {
    setGameStarted: (val: boolean) => void;
    history: History;
    setCountdownTime: (val: number) => void;
}

export function handleGameStartedMessage(dependencies: Dependencies) {
    return (props: HandleGameStartedProps) => {
        const { roomId, game, countdownTime } = props;
        const { setGameStarted, history, setCountdownTime } = dependencies;

        switch (game) {
            case GameNames.game3:
                setGameStarted(true);
                setCountdownTime(countdownTime);
                history.push(screenGame3Route(roomId));
                return;
        }
    };
}
