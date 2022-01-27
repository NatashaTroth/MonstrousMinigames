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
    currentScene?: string;
}

export const resumeHandler = messageHandler(resumedTypeGuard, (message, dependencies: Dependencies) => {
    const { scene, currentScene = PhaserGame.getInstance().currentScene } = dependencies;
    if (currentScene !== PhaserGame.SCENE_NAME_GAME_1) return;

    scene.paused = false;
    scene.players.forEach(player => {
        player.startRunning();
    });
    scene.scene.resume();

    if (localStorage.getItem('playingMusic') !== 'false') {
        scene.gameAudio?.resume();
    }
});
