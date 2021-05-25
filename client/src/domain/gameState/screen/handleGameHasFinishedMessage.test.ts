import { createMemoryHistory } from 'history';

import { GameState, MessageTypes } from '../../../utils/constants';
import { GameHasFinishedMessage } from '../../typeGuards/finished';
import { handleGameHasFinishedMessage } from './handleGameHasFinishedMessage';

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

        handleGameHasFinishedMessage({ data, roomId, dependencies: { history, setFinished, setPlayerRanks } });

        expect(history.location).toHaveProperty('pathname', `/screen/${roomId}/finished`);
    });

    it('handed setPlayerRanks should be called with passed data', () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();

        handleGameHasFinishedMessage({ data, roomId, dependencies: { history, setFinished, setPlayerRanks } });

        expect(setPlayerRanks).toHaveBeenCalledWith(data.data.playerRanks);
    });

    it('handed setFinished should be called with true', () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();

        handleGameHasFinishedMessage({ data, roomId, dependencies: { history, setFinished, setPlayerRanks } });

        expect(setFinished).toHaveBeenCalledWith(true);
    });
});
