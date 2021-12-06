import messageHandler from '../../../socket/messageHandler';
import { stunnablePlayersTypeGuard } from '../../../typeGuards/game1/stunnablePlayers';

interface Dependencies {
    setStunnablePlayers: (val: string[]) => void;
}

export const stunnablePlayersHandler = messageHandler(
    stunnablePlayersTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setStunnablePlayers(message.stunnablePlayers);
    }
);
