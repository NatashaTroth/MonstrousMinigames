import { createMemoryHistory } from 'history';

import { handlePlayerStunned } from './handlePlayerStunned';

describe('handlePlayerStunned', () => {
    const roomId = '1234';

    it('history push should be called with handed roomId', () => {
        const history = createMemoryHistory();

        handlePlayerStunned(history, roomId);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/stunned`);
    });
});
