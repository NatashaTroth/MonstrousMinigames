import { createMemoryHistory } from "history";

import { unstunnedHandler } from "../../../domain/game1/controller/gameState/unstunnedHandler";
import { InMemorySocketFake } from "../../../domain/socket/InMemorySocketFake";
import { PlayerUnstunnedMessage } from "../../../domain/typeGuards/game1/playerUnstunned";
import { MessageTypesGame1 } from "../../../utils/constants";

describe('unstunnedHandler', () => {
    const roomId = '1234';
    const message: PlayerUnstunnedMessage = {
        type: MessageTypesGame1.playerUnstunned,
    };

    it('when PlayerUnstunnedMessage is written, history push should be called with handed roomId', async () => {
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = unstunnedHandler({ history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/game1`);
    });
});
