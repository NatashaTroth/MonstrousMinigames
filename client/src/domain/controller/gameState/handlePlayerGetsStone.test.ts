import { createMemoryHistory } from 'history';

import { handlePlayerGetsStone } from './handlePlayerGetsStone';

describe('handlePlayerGetsStone', () => {
    const roomId = '1234';

    it('history push should be called with handed roomId', () => {
        const history = createMemoryHistory();

        handlePlayerGetsStone(history, roomId);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/stone`);
    });
});
