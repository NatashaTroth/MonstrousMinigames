import { createMemoryHistory } from "history";

import { resetHandler } from "../../../domain/commonGameState/controller/resetHandler";
import { InMemorySocketFake } from "../../../domain/socket/InMemorySocketFake";
import { GameHasResetMessage } from "../../../domain/typeGuards/reset";
import { MessageTypes } from "../../../utils/constants";

describe('resetHandler', () => {
    const roomId = '1234';
    const message: GameHasResetMessage = {
        type: MessageTypes.gameHasReset,
    };

    it('when GameHasResetMessage is emitted, history push should be called with handed roomId', async () => {
        const history = createMemoryHistory();
        const resetController = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = resetHandler({ history, resetController });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/lobby`);
    });
});
