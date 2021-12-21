import { Socket } from './Socket';

export class FakeInMemorySocket implements Socket {
    constructor(public callbacks: Array<<T>(val: T) => void> = [], public emitedVals: unknown[] = []) {}

    async listen(callback: <T>(val: T) => void) {
        this.callbacks.push(callback);
    }

    unlisten(callback: <T>(val: T) => void) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    async emit<T>(val: T) {
        this.emitedVals.push(val);
        this.callbacks.forEach(callback => callback(val));
    }
}
