import { PhaserGame } from '../../../phaser/PhaserGame';
import messageHandler from '../../../socket/messageHandler';
import { startedTypeGuard } from '../../../typeGuards/game1/started';

interface Dependencies {
    createGameCountdown: (val: number) => void;
}
export const startedHandler = messageHandler(startedTypeGuard, (message, dependencies: Dependencies) => {
    if (PhaserGame.getInstance().currentScene !== PhaserGame.SCENE_NAME_GAME_1) return;
    dependencies.createGameCountdown(message.countdownTime);
});
