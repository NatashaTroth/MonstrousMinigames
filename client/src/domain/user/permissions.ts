import { localDevelopment } from '../../utils/constants';
import { Navigator } from '../navigator/Navigator';
import { Window } from '../window/Window';

export async function ClickRequestDeviceMotion(window: Window) {
    // iOS: Requests permission for device orientation
    if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
        const permissionReq = await window.DeviceMotionEvent.requestPermission();
        return permissionReq === 'granted' ? true : false;
    }

    // every OS than Safari
    return true;
}

export async function getMicrophoneStream(navigator: Navigator) {
    // TODO remove
    if (localDevelopment) return true;
    try {
        // https://github.com/microsoft/TypeScript/issues/33232
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (stream) {
                (stream as MediaStream).getTracks().forEach((track: MediaStreamTrack) => track.stop());
            }

            return !!stream;
        }

        return false;
    } catch (e) {
        return false;
    }
}
