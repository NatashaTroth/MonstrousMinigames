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

export async function getMicrophoneStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}
