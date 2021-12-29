import { History } from 'history';

import { PhaserGame } from '../../../phaser/PhaserGame';
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
    if (PhaserGame.getInstance().currentScene !== PhaserGame.SCENE_NAME_GAME_1) return;
    dependencies.scene.gameAudio?.stopMusic();
    dependencies.scene.scene.stop();
});
