import messageHandler from "../socket/messageHandler";
import { resumedTypeGuard } from "../typeGuards/resumed";

interface Dependencies {
    setHasPaused: (val: boolean) => void;
}

export const resumeHandler = messageHandler(resumedTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setHasPaused(false);
});
