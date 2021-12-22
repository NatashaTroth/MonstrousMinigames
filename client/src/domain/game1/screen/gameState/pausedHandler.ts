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
}

export const pausedHandler = messageHandler(pausedTypeGuard, (message, dependencies: Dependencies) => {
    const { scene } = dependencies;
    scene.paused = true;
    scene.players.forEach(player => {
        player.stopRunning();
    });
    scene.scene.pause();
    scene.gameAudio?.pause();
});
