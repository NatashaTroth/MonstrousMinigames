import { getRandomInt } from './getRandomInt';

describe('randomInt function', () => {
    it('should return number equal or greater than min', () => {
        const min = 0;
        const max = 10;

        expect(getRandomInt(min, max)).toBeGreaterThanOrEqual(min);
    });

    it('should return number less than max', () => {
        const min = 0;
        const max = 10;

        expect(getRandomInt(min, max)).toBeLessThan(max);
    });
});
