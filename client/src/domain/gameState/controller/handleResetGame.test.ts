import { MessageTypes } from '../../../utils/constants';
import { InMemorySocketFake } from '../../socket/InMemorySocketFake';
import { handleResetGame } from './handleResetGame';

describe('handleResetGame', () => {
    const resetGame = jest.fn();
    const resetPlayer = jest.fn();

    it('when message porperty is set, backToLobby should be emitted', () => {
        const socket = new InMemorySocketFake();

        handleResetGame(
            socket,
            {
                resetGame,
                resetPlayer,
            },
            true
        );

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.backToLobby }]);
    });

    it('when message porperty is not set, nothing should be emitted', () => {
        const socket = new InMemorySocketFake();

        handleResetGame(socket, {
            resetGame,
            resetPlayer,
        });

        expect(socket.emitedVals).toEqual([]);
    });
});
