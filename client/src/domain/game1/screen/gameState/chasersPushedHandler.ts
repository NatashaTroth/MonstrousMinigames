import messageHandler from '../../../socket/messageHandler';
import { ChasersPushedTypeGuard } from '../../../typeGuards/game1/chasersPushed';

interface Dependencies {
    players: Array<{
        renderer: {
            renderWind: () => void;
        };
    }>;
}
export const chasersPushedHandler = messageHandler(ChasersPushedTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.players.forEach(player => {
        player.renderer.renderWind();
    });
});
