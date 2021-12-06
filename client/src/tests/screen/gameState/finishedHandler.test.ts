import { createMemoryHistory } from 'history';

import { finishedHandler } from '../../../domain/commonGameState/screen/finishedHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { GameHasFinishedMessage } from '../../../domain/typeGuards/finished';
import { GameState, MessageTypes } from '../../../utils/constants';
import { screenFinishedRoute } from '../../../utils/routes';

describe('finishedHandler', () => {
    const roomId = '1234';

    const data: GameHasFinishedMessage = {
        type: MessageTypes.gameHasFinished,
        data: {
            gameState: GameState.finished,
            numberOfObstacles: 4,
            roomId,
            trackLength: 400,
            playerRanks: [],
            playersState: [],
        },
    };

    it('when message type is gameHasFinished, history push should be called', async () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = finishedHandler({ history, setFinished, setPlayerRanks });
        withDependencies(socket, roomId);

        await socket.emit(data);

        expect(history.location).toHaveProperty('pathname', screenFinishedRoute(roomId));
    });

    it('handed setPlayerRanks should be called with passed data', async () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = finishedHandler({ history, setFinished, setPlayerRanks });
        withDependencies(socket, roomId);

        await socket.emit(data);

        expect(setPlayerRanks).toHaveBeenCalledWith(data.data.playerRanks);
    });

    it('handed setFinished should be called with true', async () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = finishedHandler({ history, setFinished, setPlayerRanks });
        withDependencies(socket, roomId);

        await socket.emit(data);

        expect(setFinished).toHaveBeenCalledWith(true);
    });
});
