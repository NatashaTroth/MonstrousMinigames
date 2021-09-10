import { Window } from './Window';

export class WindowAdapter implements Window {
    public DeviceMotionEvent?: {
        requestPermission?: () => Promise<string>;
    };

    public addEventListener?: any;

    constructor() {
        this.DeviceMotionEvent = global.window.DeviceMotionEvent;
        this.addEventListener = global.window.addEventListener;
    }
}

export const window = new WindowAdapter();
