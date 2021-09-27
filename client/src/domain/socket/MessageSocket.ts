/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from './Socket';

export class MessageSocket<T> {
    public map = new Map<(val: T) => void, (val: any) => void>();
    constructor(public typeGuard: (val: any) => val is T, public socket: Socket) {}

    listen(callback: (val: T) => void) {
        const filteredCallback = (val: any) => {
            if (this.typeGuard(val)) {
                callback(val);
            }
        };

        this.map.set(callback, filteredCallback);
        this.socket.listen(filteredCallback);
    }

    unlisten(callback: (val: any) => void) {
        const filteredCallback = this.map.get(callback);
        if (filteredCallback) {
            this.socket.unlisten(filteredCallback);
            this.map.delete(callback);
        }
    }

    emit(val: T) {
        this.socket.emit(val);
    }
}
