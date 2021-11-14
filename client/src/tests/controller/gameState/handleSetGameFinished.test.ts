import { initializeApp } from '@firebase/app';
import { getStorage } from '@firebase/storage';

import { GameNames } from '../../../config/games';
import { handleSetGameFinished } from '../../../domain/commonGameState/controller/handleSetGameFinished';

describe('handleSetGameFinished', () => {
    it('handed setFinished function should be called with finished value', () => {
        const setFinished = jest.fn();
        const finished = true;
        const firebaseApp = initializeApp({});
        const storage = getStorage(firebaseApp);

        handleSetGameFinished(true, GameNames.game1, storage, 'ABDE', { setFinished });

        expect(setFinished).toHaveBeenLastCalledWith(finished);
    });
});
