export default class NoRoomCodeAvailableError extends Error {
    constructor() {
        super('No more room codes are available.');
        this.name = 'NoRoomCodeAvailableError';
        //for typescript
        Object.setPrototypeOf(this, NoRoomCodeAvailableError.prototype);
    }
}
