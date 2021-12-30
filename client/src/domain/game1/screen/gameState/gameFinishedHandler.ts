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
    currentScene?: string;
}

export const gameFinishedHandler = messageHandler(finishedTypeGuard, (message, dependencies: Dependencies) => {
    const { scene, currentScene = PhaserGame.getInstance().currentScene } = dependencies;
    if (currentScene !== PhaserGame.SCENE_NAME_GAME_1) return;
    scene.gameAudio?.stopMusic();
    scene.scene.stop();
});
