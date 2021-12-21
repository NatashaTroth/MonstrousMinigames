import messageHandler from '../../../socket/messageHandler';
import { startedTypeGuard } from '../../../typeGuards/game1/started';

interface Dependencies {
    createGameCountdown: (val: number) => void;
}
export const startedHandler = messageHandler(startedTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.createGameCountdown(message.countdownTime);
});
