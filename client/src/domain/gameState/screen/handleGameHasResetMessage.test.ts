import { createMemoryHistory } from 'history';

import { handleGameHasResetMessage } from './handleGameHasResetMessage';

describe('handleGameHasResetMessage', () => {
    const roomId = '1234';

    it('when message type is gameHasReset, history push should be called', () => {
        const history = createMemoryHistory();

        handleGameHasResetMessage({ roomId, dependencies: { history } });

        expect(history.location).toHaveProperty('pathname', `/screen/${roomId}/lobby`);
    });
});
