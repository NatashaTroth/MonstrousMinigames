export async function ClickRequestDeviceMotion() {
    // iOS: Requests permission for device orientation
    if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
        const permissionReq = await window.DeviceMotionEvent.requestPermission();
        return permissionReq === 'granted' ? true : false;
    } else {
        // every OS than Safari
        return true;
    }
}
