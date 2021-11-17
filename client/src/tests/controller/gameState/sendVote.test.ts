/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';

import sendVote from '../../../domain/game3/controller/gameState/sendVote';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';

afterEach(cleanup);

describe('Send Vote', () => {
    it('returns true when the promise could be resolved', async () => {
        const socket = new InMemorySocketFake();

        const result = await sendVote('fakeuserid', 'fakephotographerid', socket);

        expect(result).toBe(true);
    });
    it('returns false when the promise could not be resolved', async () => {
        const socket = new InMemorySocketFake();
        const photographerId = '';
        const result = await sendVote('fakeuserid', photographerId, socket);

        expect(result).toBe(false);
    });
});
