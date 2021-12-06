import { createMemoryHistory } from 'history';

import { startPhaserGameHandler } from '../../../domain/game1/screen/gameState/startPhaserGameHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { StartPhaserGameMessage } from '../../../domain/typeGuards/startPhaserGame';
import { MessageTypesGame1 } from '../../../utils/constants';
import { screenGame1Route } from '../../../utils/routes';

describe('startPhaserGameHandler', () => {
    const roomId = '1234';
    const message: StartPhaserGameMessage = {
        type: MessageTypesGame1.startPhaserGame,
    };

    it('when phaser game has started, history push should be called', async () => {
        const history = createMemoryHistory();
        const setGameStarted = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = startPhaserGameHandler({ history, setGameStarted });

        withDependencies(socket, roomId);
        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', screenGame1Route(roomId));
    });

    it('handed setGameStarted should be called with true', async () => {
        const history = createMemoryHistory();
        const setGameStarted = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = startPhaserGameHandler({ history, setGameStarted });

        withDependencies(socket, roomId);
        await socket.emit(message);

        expect(setGameStarted).toHaveBeenCalledWith(true);
    });
});
