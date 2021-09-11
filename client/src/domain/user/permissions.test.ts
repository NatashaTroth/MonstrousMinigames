import { Navigator, UserMediaProps } from '../navigator/Navigator';
import { Window } from '../window/Window';
import { ClickRequestDeviceMotion, getMicrophoneStream } from './permissions';

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

describe('test getMicrophoneStream function', () => {
    it('getMicrophoneStream should return true', async () => {
        expect(await getMicrophoneStream(new NavigatorFake('granted'))).toBe(true);
    });

    it('getMicrophoneStream should return true', async () => {
        expect(await getMicrophoneStream(new NavigatorFake('denied'))).toBe(false);
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

class NavigatorFake implements Navigator {
    public mediaDevices?: {
        getUserMedia?: (val: UserMediaProps) => Promise<MediaStream | null>;
    } = {};

    constructor(public val: string) {
        this.mediaDevices = {
            getUserMedia: (values: UserMediaProps) =>
                new Promise<MediaStream | null>(resolve => {
                    if (val === 'granted') {
                        resolve({
                            active: false,
                            id: '1',
                            onaddtrack: jest.fn(),
                            onremovetrack: jest.fn(),
                            addTrack: jest.fn(),
                            clone: jest.fn(),
                            getAudioTracks: jest.fn(),
                            getTrackById: jest.fn(),
                            getTracks: () => [],
                            getVideoTracks: jest.fn(),
                            removeTrack: jest.fn(),
                            addEventListener: jest.fn(),
                            removeEventListener: jest.fn(),
                            dispatchEvent: jest.fn(),
                        });
                    } else if (val === 'denied') {
                        resolve(null);
                    }
                }),
        };
    }
}
