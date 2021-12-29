import { PhaserGame } from '../../../phaser/PhaserGame';
import messageHandler from '../../../socket/messageHandler';
import { resumedTypeGuard } from '../../../typeGuards/resumed';

interface Player {
    startRunning: () => void;
}

interface MainScene {
    players: Player[];
    gameAudio?: { resume: () => void };
    scene: {
        resume: () => void;
    };
    paused: boolean;
}

interface Dependencies {
    scene: MainScene;
}

export const resumeHandler = messageHandler(resumedTypeGuard, (message, dependencies: Dependencies) => {
    if (PhaserGame.getInstance().currentScene !== PhaserGame.SCENE_NAME_GAME_1) return;
    const { scene } = dependencies;

    scene.paused = false;
    scene.players.forEach(player => {
        player.startRunning();
    });
    scene.scene.resume();
    scene.gameAudio?.resume();
});
