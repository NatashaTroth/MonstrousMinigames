import { Navigator } from '../navigator/Navigator';
import { Window } from '../window/Window';

export async function ClickRequestDeviceMotion(window: Window) {
    // iOS: Requests permission for device orientation
    if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
        const permissionReq = await window.DeviceMotionEvent.requestPermission();
        return permissionReq === 'granted' ? true : false;
    } else {
        // every OS than Safari
        return true;
    }
}

export async function getMicrophoneStream(navigator: Navigator) {
    try {
        // https://github.com/microsoft/TypeScript/issues/33232
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const mediaDevices = navigator as any;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (stream) {
                stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
            }

            return !!stream;
        }

        return false;
    } catch (e) {
        return false;
    }
}
