import { GameData } from '../../../phaser/gameInterfaces';
import messageHandler from '../../../socket/messageHandler';
import { gameStateInfoTypeGuard } from '../../../typeGuards/game1/gameStateInfo';

interface Dependencies {
    updateGameState: (data: GameData) => void;
}
export const gameStateInfoHandler = messageHandler(gameStateInfoTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.updateGameState(message.data);
});
