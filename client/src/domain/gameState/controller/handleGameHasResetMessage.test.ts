import { createMemoryHistory } from 'history';

import { handleGameHasResetMessage } from './handleGameHasResetMessage';

describe('handleGameHasResetMessage', () => {
    const roomId = '1234';

    it('history push should be called with handed roomId', () => {
        const history = createMemoryHistory();

        handleGameHasResetMessage(history, roomId);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/lobby`);
    });
});
