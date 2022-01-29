import { moveLanesToCenter } from '../../../domain/game1/screen/gameState/moveLanesToCenter';

describe('moveLanesToCenter', () => {
    it('should position for centered lines', () => {
        const result = moveLanesToCenter(300, 100, 1, 1);
        expect(result).toEqual(300);
    });
});
