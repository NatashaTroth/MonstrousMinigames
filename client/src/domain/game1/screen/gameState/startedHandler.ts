import { PhaserGame } from '../../../phaser/PhaserGame';
import messageHandler from '../../../socket/messageHandler';
import { startedTypeGuard } from '../../../typeGuards/game1/started';

interface Dependencies {
    createGameCountdown: (val: number) => void;
    currentScene?: string;
}

export const startedHandler = messageHandler(startedTypeGuard, (message, dependencies: Dependencies) => {
    const { currentScene = PhaserGame.getInstance().currentScene, createGameCountdown } = dependencies;
    if (currentScene !== PhaserGame.SCENE_NAME_GAME_1) return;

    createGameCountdown(message.countdownTime);
});
