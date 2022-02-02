import { MessageTypes } from '../../../../utils/constants';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { allScreensPhaserGameLoadedTypeGuard } from '../../../typeGuards/game1/allScreensPhaserGameLoaded';

interface Dependencies {
    screenAdmin: boolean;
    sendCreateNewGame: () => void;
}

export const allScreensPhaserGameLoadedHandler = messageHandler(
    allScreensPhaserGameLoadedTypeGuard,
    (message, dependencies: Dependencies) => {
        if (dependencies.screenAdmin) {
            dependencies.sendCreateNewGame();
        }
    }
);

export function sendCreateNewGame(socket: Socket, roomId: string) {
    socket.emit({
        type: MessageTypes.createGame,
        roomId,
    });
}
