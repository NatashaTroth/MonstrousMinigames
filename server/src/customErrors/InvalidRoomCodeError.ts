export default class InvalidRoomCodeError extends Error {
    constructor(message = 'The given room code is invalid.') {
        super(message);
        this.name = 'InvalidRoomCodeError';
        //for typescript
        Object.setPrototypeOf(this, InvalidRoomCodeError.prototype);
    }
}
