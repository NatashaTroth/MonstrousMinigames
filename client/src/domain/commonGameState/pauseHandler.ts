import messageHandler from "../socket/messageHandler";
import { pausedTypeGuard } from "../typeGuards/paused";

interface Dependencies {
    setHasPaused: (val: boolean) => void;
}

export const pauseHandler = messageHandler(pausedTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setHasPaused(true);
});
