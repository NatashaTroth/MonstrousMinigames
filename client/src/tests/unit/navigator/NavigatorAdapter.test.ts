import { NavigatorAdapter } from '../../../domain/navigator/NavigatorAdapter';

describe('NavigatorAdapter function', () => {
    it('mediaDevices should be navigator mediaDevices', () => {
        const adapter = new NavigatorAdapter();
        expect(adapter.mediaDevices).toBe((global.navigator as NavigatorAdapter).mediaDevices);
    });
});
