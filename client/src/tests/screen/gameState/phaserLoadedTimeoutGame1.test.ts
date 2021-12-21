import { createMemoryHistory } from 'history';

import { phaserLoadedTimedOutHandler } from '../../../domain/game1/screen/gameState/phaserLoadedTimedOut';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { PhaserLoadingTimedOutMessage } from '../../../domain/typeGuards/game1/phaserLoadingTimedOut';
import { MessageTypesGame1 } from '../../../utils/constants';
import { screenLobbyRoute } from '../../../utils/routes';

describe('phaserLoadedTimeout Game1', () => {
    const message: PhaserLoadingTimedOutMessage = {
        type: MessageTypesGame1.phaserLoadingTimedOut,
    };
    const roomId = 'AKDS';

    it('when message type is phaserLoadingTimedOut, history should reroute to lobby', async () => {
        const socket = new FakeInMemorySocket();
        const history = createMemoryHistory();

        const withDependencies = phaserLoadedTimedOutHandler({ history });

        withDependencies(socket, roomId);
        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', screenLobbyRoute(roomId));
    });
});
