import { GameData } from '../../../phaser/gameInterfaces';
import messageHandler from '../../../socket/messageHandler';
import { initialGameStateInfoTypeGuard } from '../../../typeGuards/game1/initialGameStateInfo';

interface Camera {
    setBackgroundColor: (val: string) => void;
}

interface Renderer {
    destroyLoadingScreen: () => void;
}

interface Dependencies {
    screenAdmin: boolean;
    sendStartGame: () => void;
    initiateGame: (data: GameData) => void;
    gameRenderer: Renderer | undefined;
    camera: Camera | undefined;
}

export const initialGameStateHandler = messageHandler(
    initialGameStateInfoTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.gameRenderer?.destroyLoadingScreen();
        dependencies.initiateGame(message.data);
        dependencies.camera?.setBackgroundColor('rgba(0, 0, 0, 0)');

        if (dependencies.screenAdmin) {
            dependencies.sendStartGame();
        }
    }
);
