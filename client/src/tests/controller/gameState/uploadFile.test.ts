/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';

import { uploadFile } from '../../../domain/game3/controller/gameState/handleFiles';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { FakeRemoteStorage } from '../../../domain/storage/RemoteStorage';

afterEach(cleanup);

describe('Upload File', () => {
    it('returns false if no picture is given', async () => {
        const values = { picture: undefined };
        const storage = new FakeRemoteStorage();
        const socket = new FakeInMemorySocket();

        const uploadFileWithDependencies = uploadFile({
            remoteStorage: storage,
            roomId: 'ABDE',
            userId: '1',
            controllerSocket: socket,
            setLoading: jest.fn(),
            setUploadedImagesCount: jest.fn(),
            roundIdx: 1,
        });

        const result = await uploadFileWithDependencies(values, 0);
        expect(result).toBe(false);
    });
});
