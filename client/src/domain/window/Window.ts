export interface Window {
    DeviceMotionEvent?: {
        requestPermission?: () => Promise<string>;
    };
    addEventListener?: (type: string, handleEvent: (e: any) => void) => void;
}
