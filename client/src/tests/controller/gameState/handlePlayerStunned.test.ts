import { createMemoryHistory } from "history";

import { stunnedHandler } from "../../../domain/game1/controller/gameState/stunnedHandler";
import { InMemorySocketFake } from "../../../domain/socket/InMemorySocketFake";
import { PlayerStunnedMessage } from "../../../domain/typeGuards/game1/playerStunned";
import { MessageTypesGame1 } from "../../../utils/constants";

describe('stunnedHandler', () => {
    const roomId = '1234';
    const message: PlayerStunnedMessage = {
        type: MessageTypesGame1.playerStunned,
    };

    it('when PlayerStunnedMessage is written, history push should be called with handed roomId', async () => {
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = stunnedHandler({ history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/stunned`);
    });
});
