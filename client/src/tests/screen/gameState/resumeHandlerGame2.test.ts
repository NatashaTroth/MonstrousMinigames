import { resumeHandler } from '../../../domain/game2/screen/gameState/resumeHandler';
import { PhaserGame } from '../../../domain/phaser/PhaserGame';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasResumedMessage } from '../../../domain/typeGuards/resumed';
import { MessageTypes } from '../../../utils/constants';

describe('resumeHandler Game2', () => {
    const message: GameHasResumedMessage = {
        type: MessageTypes.gameHasResumed,
    };

    it('when message type is gameHasResumed, players startRunning be called', async () => {
        const socket = new FakeInMemorySocket();
        const startRunning = jest.fn();

        const scene = {
            players: [
                {
                    startRunning,
                },
            ],
            gameAudio: {
                resume: jest.fn(),
            },
            scene: {
                resume: jest.fn(),
            },
            paused: true,
        };

        const withDependencies = resumeHandler({ scene, currentScene: PhaserGame.SCENE_NAME_GAME_2 });

        withDependencies(socket);
        await socket.emit(message);

        expect(startRunning).toHaveBeenCalledTimes(1);
    });
});
