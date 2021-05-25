import { Window } from './Window';

export class WindowAdapter implements Window {
    public DeviceMotionEvent?: {
        requestPermission?: () => Promise<string>;
    };

    constructor() {
        this.DeviceMotionEvent = global.window.DeviceMotionEvent;
    }
}

export const window = new WindowAdapter();
