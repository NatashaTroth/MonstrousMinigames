import { Navigator, UserMediaProps } from "../navigator/Navigator";
import { Window } from "../window/Window";
import { ClickRequestDeviceMotion, getMicrophoneStream } from "./permissions";

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
    it('getMicrophoneStream should return true if access is granted', async () => {
        expect(await getMicrophoneStream(new NavigatorFake('granted'))).toBe(true);
    });

    it('getMicrophoneStream should return false if access is denied', async () => {
        expect(await getMicrophoneStream(new NavigatorFake('denied'))).toBe(false);
    });

    it('getMicrophoneStream should return false if error occurs', async () => {
        expect(await getMicrophoneStream(new NavigatorFake('error'))).toBe(false);
    });

    it('getMicrophoneStream should return false mediaDevices does not exist', async () => {
        expect(await getMicrophoneStream(new NavigatorFake('', false))).toBe(false);
    });

    it('getMicrophoneStream should return false getUserMedia does not exist', async () => {
        expect(await getMicrophoneStream(new NavigatorFake('', true, false))).toBe(false);
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
        getUserMedia?: (val: UserMediaProps) => Promise<MediaStream | null | Error> | undefined;
    } = {};

    constructor(public val: string, public existingMediaDevices = true, public existingGetUserMedia = true) {
        this.mediaDevices = existingMediaDevices
            ? {
                  getUserMedia: (values: UserMediaProps) =>
                      existingGetUserMedia
                          ? new Promise<MediaStream | null | Error>(resolve => {
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
                                } else if (val === 'error') {
                                    resolve(new Error('getUserMedia does not exist'));
                                }
                            })
                          : undefined,
              }
            : undefined;
    }
}
