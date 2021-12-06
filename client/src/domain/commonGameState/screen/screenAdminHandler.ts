import messageHandler from '../../socket/messageHandler';
import { screenAdminTypeGuard } from '../../typeGuards/screenAdmin';

interface Dependencies {
    setScreenAdmin: (val: boolean) => void;
}

export const screenAdminHandler = messageHandler(screenAdminTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setScreenAdmin(message.isAdmin);
});
