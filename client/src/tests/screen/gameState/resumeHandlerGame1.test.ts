import { resumeHandler } from '../../../domain/game1/screen/gameState/resumeHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { GameHasResumedMessage } from '../../../domain/typeGuards/resumed';
import { MessageTypes } from '../../../utils/constants';

describe('resumeHandler Game1', () => {
    const message: GameHasResumedMessage = {
        type: MessageTypes.gameHasResumed,
    };

    it('when message type is gameHasResumed, music resume should be called', async () => {
        const socket = new InMemorySocketFake();
        const resumeMusic = jest.fn();

        const scene = {
            players: [
                {
                    startRunning: jest.fn(),
                },
            ],
            gameAudio: {
                resume: resumeMusic,
            },
            scene: {
                resume: jest.fn(),
            },
            paused: true,
        };

        const withDependencies = resumeHandler({ scene });

        withDependencies(socket);
        await socket.emit(message);

        expect(resumeMusic).toHaveBeenCalledTimes(1);
    });
});
