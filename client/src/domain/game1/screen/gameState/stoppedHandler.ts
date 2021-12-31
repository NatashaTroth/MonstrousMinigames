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
    currentScene?: string;
}
export const stoppedHandler = messageHandler(stoppedTypeGuard, (message, dependencies: Dependencies) => {
    const { scene, currentScene = PhaserGame.getInstance().currentScene } = dependencies;

    if (currentScene !== PhaserGame.SCENE_NAME_GAME_1) return;

    scene.gameAudio?.stopMusic();
    scene.scene.stop();
});
