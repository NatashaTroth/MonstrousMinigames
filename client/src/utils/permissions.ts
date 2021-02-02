export async function ClickRequestDeviceMotion() {
    let permission = false

    // iOS: Requests permission for device orientation
    if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
        const permissionReq = await window.DeviceMotionEvent.requestPermission()
        if (permissionReq === 'granted') {
            permission = true
        }
    } else {
        // every OS than Safari
        permission = true
    }

    return permission
}
