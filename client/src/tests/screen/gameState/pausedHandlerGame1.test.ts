import { pausedHandler } from '../../../domain/game1/screen/gameState/pausedHandler';
import { PhaserGame } from '../../../domain/phaser/PhaserGame';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasPausedMessage } from '../../../domain/typeGuards/paused';
import { MessageTypes } from '../../../utils/constants';

describe('pauseHandler Game1', () => {
    const message: GameHasPausedMessage = {
        type: MessageTypes.gameHasPaused,
    };

    it('when message type is gameHasPaused, music pause should be called', async () => {
        const socket = new FakeInMemorySocket();
        const pauseMusic = jest.fn();

        const scene = {
            players: [
                {
                    stopRunning: jest.fn(),
                },
            ],
            gameAudio: {
                pause: pauseMusic,
            },
            scene: {
                pause: jest.fn(),
            },
            paused: false,
        };

        const withDependencies = pausedHandler({ scene, currentScene: PhaserGame.SCENE_NAME_GAME_1 });

        withDependencies(socket);
        await socket.emit(message);

        expect(pauseMusic).toHaveBeenCalledTimes(1);
    });
});
