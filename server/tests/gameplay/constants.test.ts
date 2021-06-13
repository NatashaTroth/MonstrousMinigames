import { localDevelopment } from '../../constants';

describe('local development', () => {
    it('localDevelopment should return false', () => {
        expect(localDevelopment).toBe(false);
    });
});
