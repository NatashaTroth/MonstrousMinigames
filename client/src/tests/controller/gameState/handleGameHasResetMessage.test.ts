import { createMemoryHistory } from "history";

import {
    handleGameHasResetMessage
} from "../../../domain/commonGameState/controller/handleGameHasResetMessage";

describe('handleGameHasResetMessage', () => {
    const roomId = '1234';
    const resetController = jest.fn();

    it('history push should be called with handed roomId', () => {
        const history = createMemoryHistory();

        handleGameHasResetMessage(history, roomId, resetController);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/lobby`);
    });
});
