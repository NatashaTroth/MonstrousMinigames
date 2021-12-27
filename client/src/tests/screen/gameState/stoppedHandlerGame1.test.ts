import { stoppedHandler } from '../../../domain/game1/screen/gameState/stoppedHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasStoppedMessage } from '../../../domain/typeGuards/stopped';
import { MessageTypes } from '../../../utils/constants';

describe('stoppedHandler Game1', () => {
    const message: GameHasStoppedMessage = {
        type: MessageTypes.gameHasStopped,
    };

    it('when message type is gameHasStopped, stopMusic should be called', async () => {
        const socket = new FakeInMemorySocket();
        const stopMusic = jest.fn();

        const scene = {
            players: [
                {
                    handleReset: jest.fn(),
                },
            ],
            gameAudio: {
                stopMusic,
            },
            scene: {
                stop: jest.fn(),
                get: jest.fn(),
            },
        };

        scene.scene.get.mockReturnValue({
            scene: {
                stop: jest.fn(),
            },
        });

        const withDependencies = stoppedHandler({ scene });

        withDependencies(socket);
        await socket.emit(message);

        expect(stopMusic).toHaveBeenCalledTimes(1);
    });
});
