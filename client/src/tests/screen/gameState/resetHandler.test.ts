import { createMemoryHistory } from 'history';

import { resetHandler } from '../../../domain/commonGameState/screen/resetHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { GameHasResetMessage } from '../../../domain/typeGuards/reset';
import { MessageTypes } from '../../../utils/constants';
import { screenLobbyRoute } from '../../../utils/routes';

describe('resetHandler', () => {
    const roomId = '1234';
    const message: GameHasResetMessage = {
        type: MessageTypes.gameHasReset,
    };

    it('when message type is gameHasReset, history push should be called', async () => {
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = resetHandler({ history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', screenLobbyRoute(roomId));
    });
});
