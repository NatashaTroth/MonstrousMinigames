import { createMemoryHistory } from 'history';

import { MessageTypes } from '../../../utils/constants';
import { screenGame1Route } from '../../../utils/routes';
import { StartPhaserGameMessage } from '../../typeGuards/startPhaserGame';
import { handleStartGameMessage } from './handleGameHasStartedMessage';

describe('handleGameHasStartedMessage', () => {
    const roomId = '1234';

    it('when message type is gameStarted, history push should be called', () => {
        const history = createMemoryHistory();
        const setCountdownTime = jest.fn();
        const setGameStarted = jest.fn();
        const data: StartPhaserGameMessage = { type: MessageTypes.startPhaserGame };

        handleStartGameMessage({ data, roomId, dependencies: { history, setGameStarted } });

        expect(history.location).toHaveProperty('pathname', screenGame1Route(roomId));
    });

    it('handed setGameStarted should be called with true', () => {
        const history = createMemoryHistory();
        const setCountdownTime = jest.fn();
        const setGameStarted = jest.fn();
        const data: StartPhaserGameMessage = { type: MessageTypes.startPhaserGame };

        handleStartGameMessage({
            data,
            roomId,
            dependencies: { history, setGameStarted },
        });

        expect(setGameStarted).toHaveBeenCalledWith(true);
    });
});
