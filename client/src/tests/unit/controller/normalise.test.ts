import { normalise } from '../../../domain/game1/controller/components/obstacles/LinearProgressBar';

describe('normalise function', () => {
    it('normalises progress', () => {
        const MIN = 0;
        const MAX = 50;
        const progress = 20;
        const value = (((progress > MAX ? MAX : progress) - MIN) * 100) / (MAX - MIN);

        expect(normalise(progress, MIN, MAX)).toBe(value);
    });

    it('handles value bigger than max', () => {
        const MIN = 0;
        const MAX = 50;
        const progress = 70;
        const value = (((progress > MAX ? MAX : progress) - MIN) * 100) / (MAX - MIN);

        expect(normalise(progress, MIN, MAX)).toBe(value);
    });
});
