import { Window } from '../window/Window';
import { ClickRequestDeviceMotion } from './permissions';

describe('test ClickRequestDeviceMotion function', () => {
    it('ClickRequestDeviceMotion should return true, when access is granted on ios', async () => {
        expect(await ClickRequestDeviceMotion(new WindowFake('granted', 'ios'))).toBe(true);
    });

    it('ClickRequestDeviceMotion should return false, when access is denied on ios', async () => {
        expect(await ClickRequestDeviceMotion(new WindowFake('denied', 'ios'))).toBe(false);
    });

    it('ClickRequestDeviceMotion should return true, when device is not ios', async () => {
        expect(await ClickRequestDeviceMotion(new WindowFake('denied', 'android'))).toBe(true);
    });
});

class WindowFake implements Window {
    public DeviceMotionEvent?: {
        requestPermission?: () => Promise<string>;
    } = {};

    constructor(public val: string, public device: string) {
        if (device === 'ios') {
            this.DeviceMotionEvent = {
                requestPermission: () =>
                    new Promise<string>(resolve => {
                        if (val === 'granted') {
                            resolve('granted');
                        } else if (val === 'denied') {
                            resolve('denied');
                        }
                    }),
            };
        } else {
            this.DeviceMotionEvent = undefined;
        }
    }
}
