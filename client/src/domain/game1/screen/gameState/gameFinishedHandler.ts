import { History } from 'history';

import messageHandler from '../../../socket/messageHandler';
import { finishedTypeGuard } from '../../../typeGuards/finished';

interface Dependencies {
    scene: {
        gameAudio?: {
            stopMusic: () => void;
        };
        scene: {
            stop: () => void;
        };
    };
    history: History;
}
export const gameFinishedHandler = messageHandler(finishedTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.scene.gameAudio?.stopMusic();
    dependencies.scene.scene.stop();
});
