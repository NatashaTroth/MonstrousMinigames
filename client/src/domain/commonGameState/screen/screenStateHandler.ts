import messageHandler from '../../socket/messageHandler';
import { screenStateTypeGuard } from '../../typeGuards/screenState';

interface Dependencies {
    setScreenState: (val: string) => void;
}

export const screenStateHandler = messageHandler(screenStateTypeGuard, (message, dependencies: Dependencies) => {
    const screenState = message.game ? `${message.state}/${message.game}` : message.state;
    dependencies.setScreenState(screenState);
});
