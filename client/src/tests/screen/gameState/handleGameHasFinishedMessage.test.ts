import { createMemoryHistory } from 'history';

import { handleGameHasFinishedMessage } from '../../../domain/commonGameState/screen/handleGameHasFinishedMessage';
import { GameHasFinishedMessage } from '../../../domain/typeGuards/finished';
import { GameState, MessageTypes } from '../../../utils/constants';
import { screenFinishedRoute } from '../../../utils/routes';

describe('handleGameHasFinishedMessage', () => {
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

    it('when message type is gameHasFinished, history push should be called', () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();

        const withDependencies = handleGameHasFinishedMessage({ history, setFinished, setPlayerRanks });
        withDependencies({ roomId, data });

        expect(history.location).toHaveProperty('pathname', screenFinishedRoute(roomId));
    });

    it('handed setPlayerRanks should be called with passed data', () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();

        const withDependencies = handleGameHasFinishedMessage({ history, setFinished, setPlayerRanks });
        withDependencies({ roomId, data });

        expect(setPlayerRanks).toHaveBeenCalledWith(data.data.playerRanks);
    });

    it('handed setFinished should be called with true', () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();

        const withDependencies = handleGameHasFinishedMessage({ history, setFinished, setPlayerRanks });
        withDependencies({ roomId, data });

        expect(setFinished).toHaveBeenCalledWith(true);
    });
});
