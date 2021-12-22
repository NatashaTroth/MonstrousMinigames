import { handleResetGame } from '../../../domain/commonGameState/screen/handleResetGame';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

describe('handleResetGame', () => {
    const resetGame = jest.fn();
    const resetGame3 = jest.fn();

    it('when message porperty is set, backToLobby should be emitted', () => {
        const socket = new FakeInMemorySocket();

        handleResetGame(
            socket,
            {
                resetGame,
                resetGame3,
            },
            true
        );

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.backToLobby }]);
    });

    it('when message porperty is not set, nothing should be emitted', () => {
        const socket = new FakeInMemorySocket();

        handleResetGame(socket, {
            resetGame,
            resetGame3,
        });

        expect(socket.emitedVals).toEqual([]);
    });
});
