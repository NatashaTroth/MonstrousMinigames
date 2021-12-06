import { createMemoryHistory } from 'history';

import { GameNames } from '../../../config/games';
import { startHandler } from '../../../domain/commonGameState/screen/startHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { GameHasStartedMessage } from '../../../domain/typeGuards/game1/started';
import { MessageTypes } from '../../../utils/constants';

describe('startHandler', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();
    const game = GameNames.game3;

    const message: GameHasStartedMessage = {
        type: MessageTypes.gameHasStarted,
        game,
        countdownTime: 3000,
    };

    it('handed setGameStarted should be called with true', async () => {
        const socket = new InMemorySocketFake();
        const withDependencies = startHandler({ setGameStarted, history, setCountdownTime: jest.fn() });

        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });
});
