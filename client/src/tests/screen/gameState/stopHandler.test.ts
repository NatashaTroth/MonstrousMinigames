import { createMemoryHistory } from 'history';

import { stopHandler } from '../../../domain/commonGameState/screen/stopHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { GameHasStoppedMessage } from '../../../domain/typeGuards/stopped';
import { MessageTypes } from '../../../utils/constants';
import { screenLobbyRoute } from '../../../utils/routes';

describe('stopHandler', () => {
    const roomId = '1234';
    const message: GameHasStoppedMessage = {
        type: MessageTypes.gameHasStopped,
    };

    it('when message type is gameHasStopped, history push should be called', async () => {
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = stopHandler({ history });

        withDependencies(socket, roomId);
        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', screenLobbyRoute(roomId));
    });
});
