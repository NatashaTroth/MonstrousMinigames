import { createMemoryHistory } from 'history';

import { InMemorySocketFake } from '../../socket/InMemorySocketFake';
import { handleGameHasStoppedMessage } from './handleGameHasStoppedMessage';

describe('handleGameHasStoppedMessage', () => {
    const roomId = '1234';
    const socket = new InMemorySocketFake();

    it('handed resetGame should be called', () => {
        const resetGame = jest.fn();
        const resetPlayer = jest.fn();
        const history = createMemoryHistory();

        handleGameHasStoppedMessage({
            socket,
            roomId,
            dependencies: {
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(resetGame).toHaveBeenCalledTimes(1);
    });

    it('handed resetPlayer should be called', () => {
        const resetGame = jest.fn();
        const resetPlayer = jest.fn();
        const history = createMemoryHistory();

        handleGameHasStoppedMessage({
            socket,
            roomId,
            dependencies: {
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(resetPlayer).toHaveBeenCalledTimes(1);
    });

    it('when message type is gameHasStopped, history push should be called', () => {
        const resetGame = jest.fn();
        const resetPlayer = jest.fn();
        const history = createMemoryHistory();

        handleGameHasStoppedMessage({
            socket,
            roomId,
            dependencies: {
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/lobby`);
    });
});
