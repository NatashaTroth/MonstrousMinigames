import { createMemoryHistory } from 'history';

import { handlePlayerGetsWindmill } from '../../../domain/game1/controller/gameState/handlePlayerGetsWindmill';

describe('handlePlayerGetsWindmill', () => {
    const roomId = '1234';

    it('history push should be called with handed roomId', () => {
        const history = createMemoryHistory();

        handlePlayerGetsWindmill(history, roomId);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/windmill`);
    });
});
