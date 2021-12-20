/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';

import uploadFile from '../../../domain/game3/controller/gameState/handleFiles';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { FakeRemoteStorage } from '../../../domain/storage/RemoteStorage';
import { MessageTypesGame3 } from '../../../utils/constants';

afterEach(cleanup);

describe('Upload File', () => {
    it('returns false if no picture is given', async () => {
        const values = { picture: undefined };
        const storage = new FakeRemoteStorage();
        const socket = new InMemorySocketFake();

        const result = await uploadFile(values, storage, 'ABDE', '1', 1, socket, 0);
        expect(result).toBe(false);
    });

    it('should call uploadImage function of storage', async () => {
        const values = { picture: new File([''], 'filename') };
        const storage = new FakeRemoteStorage();
        const socket = new InMemorySocketFake();

        const uploadImageSpy = jest.spyOn(storage, 'uploadImage');

        await uploadFile(values, storage, 'ABDE', '1', 1, socket, 0);

        expect(uploadImageSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit imageUrl to socket after successful upload', async () => {
        const values = { picture: new File([''], 'filename') };
        const storage = new FakeRemoteStorage();
        const socket = new InMemorySocketFake();

        await uploadFile(values, storage, 'ABDE', '1', 1, socket, 0);

        expect(socket.emitedVals).toEqual([{ type: MessageTypesGame3.photo, photographerId: '1', url: 'path' }]);
    });
});
