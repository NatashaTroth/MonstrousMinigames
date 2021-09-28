import { createMemoryHistory } from 'history';

import { handlePlayerUnstunned } from './handlePlayerUnstunned';

describe('handlePlayerUnstunned', () => {
    const roomId = '1234';

    it('history push should be called with handed roomId', () => {
        const history = createMemoryHistory();

        handlePlayerUnstunned(history, roomId);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/game1`);
    });
});
