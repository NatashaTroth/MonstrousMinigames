import { MessageTypes } from './constants';
import { handleResetGame } from './handleResetGame';
import { InMemorySocketFake } from './socket/InMemorySocketFake';

describe('handleResetGame', () => {
    const resetGame = jest.fn();
    const resetPlayer = jest.fn();
    it('backToLobby should be emitted', () => {
        const socket = new InMemorySocketFake();

        handleResetGame(socket, {
            resetGame,
            resetPlayer,
        });

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.backToLobby }]);
    });
});
