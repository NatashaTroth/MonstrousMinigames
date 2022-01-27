/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';

import uploadFile from '../../../domain/game3/controller/gameState/handleFiles';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { FakeRemoteStorage } from '../../../domain/storage/RemoteStorage';

afterEach(cleanup);

describe('Upload File', () => {
    it('returns false if no picture is given', async () => {
        const values = { picture: undefined };
        const storage = new FakeRemoteStorage();
        const socket = new FakeInMemorySocket();

        const result = await uploadFile(values, storage, 'ABDE', '1', 1, socket, 0);
        expect(result).toBe(false);
    });
});
