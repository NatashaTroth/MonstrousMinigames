import { GameNames } from '../../../config/games';
import { startedHandler } from '../../../domain/game1/screen/gameState/startedHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasStartedMessage } from '../../../domain/typeGuards/game1/started';
import { MessageTypes } from '../../../utils/constants';

describe('startedHandler Game1', () => {
    const message: GameHasStartedMessage = {
        type: MessageTypes.gameHasStarted,
        countdownTime: 3000,
        game: GameNames.game1,
    };

    it('when message type is gameHasStarted, createGameCountdown should be called', async () => {
        const socket = new FakeInMemorySocket();
        const createGameCountdown = jest.fn();

        const withDependencies = startedHandler({ createGameCountdown });

        withDependencies(socket);
        await socket.emit(message);

        expect(createGameCountdown).toHaveBeenCalledTimes(1);
    });
});
