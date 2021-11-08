import { handleSetGameFinished } from '../../../domain/commonGameState/controller/handleSetGameFinished';

describe('handleSetGameFinished', () => {
    it('handed setFinished function should be called with finished value', () => {
        const setFinished = jest.fn();
        const finished = true;

        handleSetGameFinished(true, { setFinished });

        expect(setFinished).toHaveBeenLastCalledWith(finished);
    });
});
