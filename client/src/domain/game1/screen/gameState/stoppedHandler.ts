import messageHandler from '../../../socket/messageHandler';
import { stoppedTypeGuard } from '../../../typeGuards/stopped';

interface Player {
    handleReset: () => void;
}

interface MainScene {
    players: Player[];
    gameAudio?: { stopMusic: () => void };
    scene: {
        restart: () => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get: (name: string) => any;
    };
}

interface Dependencies {
    scene: MainScene;
}
export const stoppedHandler = messageHandler(stoppedTypeGuard, (message, dependencies: Dependencies) => {
    const { scene } = dependencies;

    scene.gameAudio?.stopMusic();
    scene.players.forEach(player => {
        player.handleReset();
    });

    scene.scene.get('MainScene').scene.restart();
    scene.scene.restart();
});
