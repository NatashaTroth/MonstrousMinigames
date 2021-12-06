import messageHandler from '../../../socket/messageHandler';
import { finalRoundCountdownTypeGuard } from '../../../typeGuards/game3/finalRoundCountdown';

interface Dependencies {
    setFinalRoundCountdownTime: (time: number) => void;
}

export const finalRoundCountdownHandler = messageHandler(
    finalRoundCountdownTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setFinalRoundCountdownTime(message.countdownTime);
    }
);
