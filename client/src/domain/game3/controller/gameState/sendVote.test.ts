/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';

import { InMemorySocketFake } from '../../../socket/InMemorySocketFake';
import sendVote from './sendVote';

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
