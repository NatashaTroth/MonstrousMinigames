import { createMemoryHistory } from 'history';

import { handleGameHasStoppedMessage } from './handleGameHasStoppedMessage';

describe('handleGameHasStoppedMessage', () => {
    const roomId = '1234';

    it('when message type is gameHasStopped, history push should be called', () => {
        const history = createMemoryHistory();

        handleGameHasStoppedMessage({ roomId, dependencies: { history } });

        expect(history.location).toHaveProperty('pathname', `/screen/${roomId}/lobby`);
    });
});
