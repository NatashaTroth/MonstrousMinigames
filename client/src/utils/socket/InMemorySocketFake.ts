import { Socket } from './Socket';

export class InMemorySocketFake implements Socket {
    constructor(public callbacks: Array<<T>(val: T) => void> = [], public emitedVals: unknown[] = []) {}

    listen(callback: <T>(val: T) => void) {
        this.callbacks.push(callback);
    }

    emit<T>(val: T) {
        this.emitedVals.push(val);
        this.callbacks.forEach(callback => callback(val));
    }
}
