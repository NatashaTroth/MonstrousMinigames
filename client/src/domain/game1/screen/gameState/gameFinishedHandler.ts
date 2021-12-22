import { History } from 'history';

import { screenFinishedRoute } from '../../../../utils/routes';
import messageHandler from '../../../socket/messageHandler';
import { finishedTypeGuard } from '../../../typeGuards/finished';

interface Dependencies {
    scene: {
        gameAudio?: {
            stopMusic: () => void;
        };
    };
    history: History;
}
export const gameFinishedHandler = messageHandler(finishedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.scene.gameAudio?.stopMusic();
    dependencies.history.push(screenFinishedRoute(roomId));
});
