import { WindowAdapter } from "../../domain/window/WindowAdapter";

describe('WindowAdapter function', () => {
    it('device motion event should be window device motion event', () => {
        const adapter = new WindowAdapter();
        expect(adapter.DeviceMotionEvent).toBe(global.window.DeviceMotionEvent);
    });
});
