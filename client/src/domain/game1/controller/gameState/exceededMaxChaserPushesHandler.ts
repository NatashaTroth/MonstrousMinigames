import messageHandler from '../../../socket/messageHandler';
import { exceededMaxChaserPushesTypeGuard } from '../../../typeGuards/game1/exceededMaxChaserPushes';

interface Dependencies {
    setExceededChaserPushes: (val: boolean) => void;
}

export const exceededMaxChaserPushesHandler = messageHandler(
    exceededMaxChaserPushesTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setExceededChaserPushes(true);
    }
);
