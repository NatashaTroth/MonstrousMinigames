import { createMemoryHistory } from "history";

import { stopHandler } from "../../../domain/commonGameState/controller/stopHandler";
import { InMemorySocketFake } from "../../../domain/socket/InMemorySocketFake";
import { GameHasStoppedMessage } from "../../../domain/typeGuards/stopped";
import { MessageTypes } from "../../../utils/constants";
import { controllerLobbyRoute } from "../../../utils/routes";

describe('stopHandler', () => {
    const roomId = 'ADFS';
    const mockData: GameHasStoppedMessage = {
        type: MessageTypes.gameHasStopped,
    };

    it('when GameHasStoppedMessage is emitted, it should be reroutet to lobby', async () => {
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = stopHandler({ history });
        withDependencies(socket, roomId);

        await socket.emit(mockData);

        expect(history.location).toHaveProperty('pathname', controllerLobbyRoute(roomId));
    });
});
