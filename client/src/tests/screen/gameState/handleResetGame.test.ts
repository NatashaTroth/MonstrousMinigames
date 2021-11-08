import { handleResetGame } from '../../../domain/commonGameState/screen/handleResetGame';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

describe('handleResetGame', () => {
    const resetGame = jest.fn();
    it('when message porperty is set, backToLobby should be emitted', () => {
        const socket = new InMemorySocketFake();

        handleResetGame(
            socket,
            {
                resetGame,
            },
            true
        );

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.backToLobby }]);
    });

    it('when message porperty is not set, nothing should be emitted', () => {
        const socket = new InMemorySocketFake();

        handleResetGame(socket, {
            resetGame,
        });

        expect(socket.emitedVals).toEqual([]);
    });
});
