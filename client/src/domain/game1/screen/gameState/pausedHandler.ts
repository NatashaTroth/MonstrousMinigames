import { PhaserGame } from '../../../phaser/PhaserGame';
import messageHandler from '../../../socket/messageHandler';
import { pausedTypeGuard } from '../../../typeGuards/paused';

interface Player {
    stopRunning: () => void;
}

interface MainScene {
    players: Player[];
    gameAudio?: { pause: () => void };
    scene: {
        pause: () => void;
    };
    paused: boolean;
}

interface Dependencies {
    scene: MainScene;
    currentScene?: string;
}

export const pausedHandler = messageHandler(pausedTypeGuard, (message, dependencies: Dependencies) => {
    const { scene, currentScene = PhaserGame.getInstance().currentScene } = dependencies;

    if (currentScene !== PhaserGame.SCENE_NAME_GAME_1) return;

    scene.paused = true;
    scene.players.forEach(player => {
        player.stopRunning();
    });
    scene.scene.pause();
    scene.gameAudio?.pause();
});
