/* eslint-disable simple-import-sort/imports */
import "jest-styled-components";
import { cleanup } from "@testing-library/react";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

import uploadFile from "../../../domain/game3/controller/gameState/handleFiles";
import { InMemorySocketFake } from "../../../domain/socket/InMemorySocketFake";

afterEach(cleanup);

describe('Upload File', () => {
    it('returns false if no picture is given', async () => {
        const values = { picture: undefined };
        const firebaseApp = initializeApp({});
        const storage = getStorage(firebaseApp);
        const socket = new InMemorySocketFake();

        const result = await uploadFile(values, storage, 'ABDE', '1', 1, socket, 0);
        expect(result).toBe(false);
    });
});
