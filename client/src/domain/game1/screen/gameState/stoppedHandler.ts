import { PhaserGame } from '../../../phaser/PhaserGame';
import messageHandler from '../../../socket/messageHandler';
import { stoppedTypeGuard } from '../../../typeGuards/stopped';

interface Player {
    handleReset: () => void;
}

interface MainScene {
    players: Player[];
    gameAudio?: { stopMusic: () => void };
    scene: {
        stop: () => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get: (name: string) => any;
    };
}

interface Dependencies {
    scene: MainScene;
}
export const stoppedHandler = messageHandler(stoppedTypeGuard, (message, dependencies: Dependencies) => {
    if (PhaserGame.getInstance().currentScene !== PhaserGame.SCENE_NAME_GAME_1) return;
    const { scene } = dependencies;
    scene.gameAudio?.stopMusic();
    scene.scene.stop();
});
