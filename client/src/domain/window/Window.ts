export interface Window {
    DeviceMotionEvent?: {
        requestPermission?: () => Promise<string>;
    };
}
